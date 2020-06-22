const mainTailList = {
  "t6_17_11": {
      "name": "Нереализованный талант",
      "description": ""
  },
  "t11_8_15": {
      "name": "Хвост агрессии",
      "description": ""
  },
  "t21_4_10": {
      "name": "Унетённая душа",
      "description": ""
  },
  "t15_22": {
      "name": "Зависимость, невсвобода",
      "description": ""
  },
  "t22_7": {
      "name": "Не хочет иметь семью",
      "description": ""
  },
  "t14_20_6": {
      "name": "Хвост жертвы",
      "description": ""
  },
  "t9_9_18": {
      "name": "Хвост мага",
      "description": ""
  }
}
new Vue({
  el: '#app',
  data: {
    name: '',
    date: "2020-06-12",
    saves: localStorage.saves ? JSON.parse(localStorage.saves) : [],
    savesListDisplay: false,
    deleteMode: false,
    mainMenuHidden: false,
    showResults: false,
    currentMatrix: undefined,
  },
  methods: {
    loadMatrix: function (newMatrix) {
      if (!this.deleteMode) {
        this.date = newMatrix.date;
        this.name = newMatrix.name;
        this.engageMatrix(this.name, this.date);
      }
    },
    calculate: function () {
      if (this.date != undefined) {
        if (this.name != '') {
          this.saves.push({
            date: this.date,
            name: this.name
          });
          localStorage.saves = JSON.stringify(this.saves);
        }
        this.engageMatrix(this.name || "Безымянная", this.date);
      } else {
        alert('Введено неверное имя или дата!')
      }
    },
    engageMatrix: function (name, date) {
      this.currentMatrix = this.createMatrix(date, name)
      this.showResults = true;
      this.mainMenuHidden = true;
      this.savesListDisplay = false;
    },
    deleteMatrix: function (index) {
      this.saves.splice(index, 1);
      localStorage.saves = JSON.stringify(this.saves);
    },
    getAge: function (dateString) {
      let date = new Date(dateString);
      return Math.floor(((new Date()).getTime() - date.getTime()) / (1000 * 3600 * 24 * 365))
    },
    splitAndAdd: function (inNumber) {
      const countOfEnegries = 22;
      let newNumber;
      if (inNumber <= countOfEnegries) {
          return inNumber;
      } else if (inNumber > 999) newNumber = Math.floor(inNumber/1000) + Math.floor((inNumber/100)%10) + Math.floor((inNumber/10)%10) + Math.floor(inNumber%10);
      else if (inNumber > 99) newNumber = Math.floor((inNumber/100)%10) + Math.floor((inNumber/10)%10) + Math.floor(inNumber%10);
      else newNumber = Math.floor((inNumber/10)%10) + Math.floor(inNumber%10);
      return this.splitAndAdd(newNumber);
    },
    createMatrix: function (date, name) {
      // последовательный подсчёт энергий 
      // личный (диагональный) квадрат
      let data = {
        name: name,
        date: date,
        u00: this.matrixElement(parseInt(date.split('-')[2])),
        u16: this.matrixElement(parseInt(date.split('-')[1])),
        u32: this.matrixElement(parseInt(date.split('-')[0]))
      }
      data.u48 = this.matrixElement(data.u00.arcane + data.u16.arcane + data.u32.arcane);
      // родовой (прямой) квадрат
      data.u08 = this.matrixElement(data.u00.arcane + data.u16.arcane);
      data.u24 = this.matrixElement(data.u16.arcane + data.u32.arcane);
      data.u40 = this.matrixElement(data.u32.arcane + data.u48.arcane);
      data.u56 = this.matrixElement(data.u48.arcane + data.u00.arcane);
      // промежутки
      // 1 октал 0 - 8
      data.u04 = this.matrixElement(data.u00.arcane + data.u08.arcane);
      data.u02 = this.matrixElement(data.u00.arcane + data.u04.arcane);
      data.u01 = this.matrixElement(data.u00.arcane + data.u02.arcane);
      data.u03 = this.matrixElement(data.u02.arcane + data.u04.arcane);
      data.u06 = this.matrixElement(data.u04.arcane + data.u08.arcane);
      data.u05 = this.matrixElement(data.u04.arcane + data.u06.arcane);
      data.u07 = this.matrixElement(data.u06.arcane + data.u08.arcane);
      // 2 октал 8 - 16
      data.u12 = this.matrixElement(data.u08.arcane + data.u16.arcane);
      data.u14 = this.matrixElement(data.u12.arcane + data.u16.arcane);
      data.u15 = this.matrixElement(data.u14.arcane + data.u16.arcane);
      data.u10 = this.matrixElement(data.u08.arcane + data.u12.arcane);
      data.u09 = this.matrixElement(data.u08.arcane + data.u10.arcane);
      data.u11 = this.matrixElement(data.u12.arcane + data.u10.arcane);
      data.u13 = this.matrixElement(data.u12.arcane + data.u14.arcane);
      // 3 октал 16 - 24
      data.u20 = this.matrixElement(data.u16.arcane + data.u24.arcane);
      data.u18 = this.matrixElement(data.u20.arcane + data.u16.arcane);
      data.u17 = this.matrixElement(data.u18.arcane + data.u16.arcane);
      data.u19 = this.matrixElement(data.u18.arcane + data.u20.arcane);
      data.u22 = this.matrixElement(data.u20.arcane + data.u24.arcane);
      data.u21 = this.matrixElement(data.u20.arcane + data.u22.arcane);
      data.u23 = this.matrixElement(data.u22.arcane + data.u24.arcane);
      // 4 октал 24 - 32
      data.u28 = this.matrixElement(data.u32.arcane + data.u24.arcane);
      data.u26 = this.matrixElement(data.u28.arcane + data.u24.arcane);
      data.u25 = this.matrixElement(data.u26.arcane + data.u24.arcane);
      data.u27 = this.matrixElement(data.u26.arcane + data.u28.arcane);
      data.u30 = this.matrixElement(data.u28.arcane + data.u32.arcane);
      data.u29 = this.matrixElement(data.u30.arcane + data.u28.arcane);
      data.u31 = this.matrixElement(data.u30.arcane + data.u32.arcane);
      // 5 октал 32 - 40
      data.u36 = this.matrixElement(data.u32.arcane + data.u40.arcane);
      data.u34 = this.matrixElement(data.u32.arcane + data.u36.arcane);
      data.u33 = this.matrixElement(data.u32.arcane + data.u34.arcane);
      data.u35 = this.matrixElement(data.u34.arcane + data.u36.arcane);
      data.u38 = this.matrixElement(data.u36.arcane + data.u40.arcane);
      data.u37 = this.matrixElement(data.u38.arcane + data.u36.arcane);
      data.u39 = this.matrixElement(data.u38.arcane + data.u40.arcane);
      // 6 октал 40 - 48
      data.u44 = this.matrixElement(data.u40.arcane + data.u48.arcane);
      data.u42 = this.matrixElement(data.u40.arcane + data.u44.arcane);
      data.u41 = this.matrixElement(data.u42.arcane + data.u40.arcane);
      data.u43 = this.matrixElement(data.u42.arcane + data.u44.arcane);
      data.u46 = this.matrixElement(data.u44.arcane + data.u48.arcane);
      data.u45 = this.matrixElement(data.u46.arcane + data.u44.arcane);
      data.u47 = this.matrixElement(data.u46.arcane + data.u48.arcane);
      // 7 октал 48 - 56
      data.u52 = this.matrixElement(data.u48.arcane + data.u56.arcane);
      data.u50 = this.matrixElement(data.u52.arcane + data.u48.arcane);
      data.u49 = this.matrixElement(data.u50.arcane + data.u48.arcane);
      data.u51 = this.matrixElement(data.u52.arcane + data.u50.arcane);
      data.u54 = this.matrixElement(data.u52.arcane + data.u56.arcane);
      data.u53 = this.matrixElement(data.u54.arcane + data.u52.arcane);
      data.u55 = this.matrixElement(data.u54.arcane + data.u56.arcane);
      // 7 октал 56 - 0
      data.u60 = this.matrixElement(data.u56.arcane + data.u00.arcane);
      data.u58 = this.matrixElement(data.u60.arcane + data.u56.arcane);
      data.u57 = this.matrixElement(data.u58.arcane + data.u56.arcane);
      data.u59 = this.matrixElement(data.u60.arcane + data.u58.arcane);
      data.u62 = this.matrixElement(data.u60.arcane + data.u00.arcane);
      data.u61 = this.matrixElement(data.u62.arcane + data.u60.arcane);
      data.u63 = this.matrixElement(data.u62.arcane + data.u00.arcane);

      data.c00 = this.matrixElement(data.u00.arcane + data.u16.arcane + data.u32.arcane + data.u48.arcane);
  
      data.c02 = this.matrixElement(data.c00.arcane + data.u00.arcane);
      data.c01 = this.matrixElement(data.c02.arcane + data.c00.arcane);
      data.c03 = this.matrixElement(data.u00.arcane + data.c02.arcane);

      data.c11 = this.matrixElement(data.c00.arcane + data.u08.arcane);
      data.c12 = this.matrixElement(data.c11.arcane + data.u08.arcane);

      data.c22 = this.matrixElement(data.c00.arcane + data.u16.arcane);
      data.c21 = this.matrixElement(data.c00.arcane + data.c22.arcane);
      data.c23 = this.matrixElement(data.c22.arcane + data.u16.arcane);

      data.c31 = this.matrixElement(data.c00.arcane + data.u24.arcane);
      data.c32 = this.matrixElement(data.c31.arcane + data.u24.arcane);

      data.c41 = this.matrixElement(data.c00.arcane + data.u32.arcane);
      data.c42 = this.matrixElement(data.c41.arcane + data.u32.arcane);
      
      data.c52 = this.matrixElement(data.c00.arcane + data.u40.arcane);
      data.c53 = this.matrixElement(data.c52.arcane + data.u40.arcane);

      data.c61 = this.matrixElement(data.c00.arcane + data.u48.arcane);
      data.c62 = this.matrixElement(data.u48.arcane + data.c61.arcane);
      
      data.c71 = this.matrixElement(data.c00.arcane + data.u56.arcane);
      data.c72 = this.matrixElement(data.u56.arcane + data.c71.arcane);

      data.c51 = this.matrixElement(data.c41.arcane + data.c61.arcane);
      data.s01 = this.matrixElement(data.c41.arcane + data.c51.arcane);
      data.s02 = this.matrixElement(data.c61.arcane + data.c51.arcane);
      // под таблицей
      // небо - земля 
      data.b01 = this.matrixElement(data.u16.arcane + data.u48.arcane);
      data.b02 = this.matrixElement(data.u00.arcane + data.u32.arcane);
      data.b03 = this.matrixElement(data.b01.arcane + data.b02.arcane);
      // мужское - женское 
      data.b04 = this.matrixElement(data.u08.arcane + data.u40.arcane);
      data.b05 = this.matrixElement(data.u56.arcane + data.u24.arcane);
      data.b06 = this.matrixElement(data.b04.arcane + data.b05.arcane);
      // духовное
      data.b07 = this.matrixElement(data.b06.arcane + data.b03.arcane);
      //таблица здоровья

      data.t11 = this.matrixElement(data.u00.arcane);
      data.t12 = this.matrixElement(data.u16.arcane);
      data.t13 = this.matrixElement(data.t11.arcane + data.t12.arcane);

      data.t21 = this.matrixElement(data.c03.arcane);
      data.t22 = this.matrixElement(data.c23.arcane);
      data.t23 = this.matrixElement(data.t21.arcane + data.t22.arcane);

      data.t31 = this.matrixElement(data.c02.arcane);
      data.t32 = this.matrixElement(data.c22.arcane);
      data.t33 = this.matrixElement(data.t31.arcane + data.t32.arcane);

      data.t41 = this.matrixElement(data.c01.arcane);
      data.t42 = this.matrixElement(data.c21.arcane);
      data.t43 = this.matrixElement(data.t41.arcane + data.t42.arcane);

      data.t51 = this.matrixElement(data.c00.arcane);
      data.t52 = this.matrixElement(data.c00.arcane);
      data.t53 = this.matrixElement(data.t51.arcane + data.t52.arcane);

      data.t61 = this.matrixElement(data.c41.arcane);
      data.t62 = this.matrixElement(data.c61.arcane);
      data.t63 = this.matrixElement(data.t61.arcane + data.t62.arcane);

      data.t71 = this.matrixElement(data.u32.arcane);
      data.t72 = this.matrixElement(data.u48.arcane);
      data.t73 = this.matrixElement(data.t71.arcane + data.t72.arcane);

      data.t81 = this.matrixElement(data.t11.arcane + data.t21.arcane + data.t31.arcane + data.t41.arcane + data.t51.arcane + data.t61.arcane + data.t71.arcane);
      data.t82 = this.matrixElement(data.t12.arcane + data.t22.arcane + data.t32.arcane + data.t42.arcane + data.t52.arcane + data.t62.arcane + data.t72.arcane);
      data.t83 = this.matrixElement(data.t81.arcane + data.t82.arcane);

      return data;
    },
    matrixElement: function (number) {
      return {
        arcane: this.splitAndAdd(number),
        neighborPairList: []
      }
    }
  }
});