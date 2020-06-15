"use strict";

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
    currentMatrix: undefined
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
      this.currentMatrix = new MatrixOfLife(date, name)
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
    }
  }
});

const splitAndAdd = (inNumber) => {
  const countOfEnegries = 22;
  let newNumber;
  if (inNumber <= countOfEnegries) {
      return inNumber;
  } else if (inNumber > 999) newNumber = Math.floor(inNumber/1000) + Math.floor((inNumber/100)%10) + Math.floor((inNumber/10)%10) + Math.floor(inNumber%10);
  else if (inNumber > 99) newNumber = Math.floor((inNumber/100)%10) + Math.floor((inNumber/10)%10) + Math.floor(inNumber%10);
  else newNumber = Math.floor((inNumber/10)%10) + Math.floor(inNumber%10);
  return splitAndAdd(newNumber);
}

class MatrixOfLife {
  constructor(startDate, name) {
      // последовательный подсчёт энергий 
      // личный (диагональный) квадрат
      this.name = name || '';
      this.u00 = new MatrixOfLifeElements(parseInt(startDate.split('-')[2]), 'u00', true);
      this.u16 = new MatrixOfLifeElements(parseInt(startDate.split('-')[1]), 'u16');
      this.u32 = new MatrixOfLifeElements(parseInt(startDate.split('-')[0]), 'u32');
      this.u48 = new MatrixOfLifeElements(this.u00.getArcane() + this.u16.getArcane() + this.u32.getArcane(), 'u48');
      // родовой (прямой) квадрат
      this.u08 = new MatrixOfLifeElements(this.u00.getArcane() + this.u16.getArcane(), 'u08');
      this.u24 = new MatrixOfLifeElements(this.u16.getArcane() + this.u32.getArcane(), 'u24');
      this.u40 = new MatrixOfLifeElements(this.u32.getArcane() + this.u48.getArcane(), 'u40');
      this.u56 = new MatrixOfLifeElements(this.u48.getArcane() + this.u00.getArcane(), 'u56');
      // промежутки
      // 1 октал 0 - 8
      this.u04 = new MatrixOfLifeElements(this.u00.getArcane() + this.u08.getArcane(), 'u04');
      this.u02 = new MatrixOfLifeElements(this.u00.getArcane() + this.u04.getArcane(), 'u02');
      this.u01 = new MatrixOfLifeElements(this.u00.getArcane() + this.u02.getArcane(), 'u01');
      this.u03 = new MatrixOfLifeElements(this.u02.getArcane() + this.u04.getArcane(), 'u03');
      this.u06 = new MatrixOfLifeElements(this.u04.getArcane() + this.u08.getArcane(), 'u06');
      this.u05 = new MatrixOfLifeElements(this.u04.getArcane() + this.u06.getArcane(), 'u05');
      this.u07 = new MatrixOfLifeElements(this.u06.getArcane() + this.u08.getArcane(), 'u07');
      // 2 октал 8 - 16
      this.u12 = new MatrixOfLifeElements(this.u08.getArcane() + this.u16.getArcane(), 'u12');
      this.u14 = new MatrixOfLifeElements(this.u12.getArcane() + this.u16.getArcane(), 'u14');
      this.u15 = new MatrixOfLifeElements(this.u14.getArcane() + this.u16.getArcane(), 'u15');
      this.u10 = new MatrixOfLifeElements(this.u08.getArcane() + this.u12.getArcane(), 'u10');
      this.u09 = new MatrixOfLifeElements(this.u08.getArcane() + this.u10.getArcane(), 'u09');
      this.u11 = new MatrixOfLifeElements(this.u12.getArcane() + this.u10.getArcane(), 'u11');
      this.u13 = new MatrixOfLifeElements(this.u12.getArcane() + this.u14.getArcane(), 'u13');
      // 3 октал 16 - 24
      this.u20 = new MatrixOfLifeElements(this.u16.getArcane() + this.u24.getArcane(), 'u20');
      this.u18 = new MatrixOfLifeElements(this.u20.getArcane() + this.u16.getArcane(), 'u18');
      this.u17 = new MatrixOfLifeElements(this.u18.getArcane() + this.u16.getArcane(), 'u17');
      this.u19 = new MatrixOfLifeElements(this.u18.getArcane() + this.u20.getArcane(), 'u19');
      this.u22 = new MatrixOfLifeElements(this.u20.getArcane() + this.u24.getArcane(), 'u22');
      this.u21 = new MatrixOfLifeElements(this.u20.getArcane() + this.u22.getArcane(), 'u21');
      this.u23 = new MatrixOfLifeElements(this.u22.getArcane() + this.u24.getArcane(), 'u23');
      // 4 октал 24 - 32
      this.u28 = new MatrixOfLifeElements(this.u32.getArcane() + this.u24.getArcane(), 'u28');
      this.u26 = new MatrixOfLifeElements(this.u28.getArcane() + this.u24.getArcane(), 'u26');
      this.u25 = new MatrixOfLifeElements(this.u26.getArcane() + this.u24.getArcane(), 'u25');
      this.u27 = new MatrixOfLifeElements(this.u26.getArcane() + this.u28.getArcane(), 'u27');
      this.u30 = new MatrixOfLifeElements(this.u28.getArcane() + this.u32.getArcane(), 'u30');
      this.u29 = new MatrixOfLifeElements(this.u30.getArcane() + this.u28.getArcane(), 'u29');
      this.u31 = new MatrixOfLifeElements(this.u30.getArcane() + this.u32.getArcane(), 'u31');
      // 5 октал 32 - 40
      this.u36 = new MatrixOfLifeElements(this.u32.getArcane() + this.u40.getArcane(), 'u36');
      this.u34 = new MatrixOfLifeElements(this.u32.getArcane() + this.u36.getArcane(), 'u34');
      this.u33 = new MatrixOfLifeElements(this.u32.getArcane() + this.u34.getArcane(), 'u33');
      this.u35 = new MatrixOfLifeElements(this.u34.getArcane() + this.u36.getArcane(), 'u35');
      this.u38 = new MatrixOfLifeElements(this.u36.getArcane() + this.u40.getArcane(), 'u38');
      this.u37 = new MatrixOfLifeElements(this.u38.getArcane() + this.u36.getArcane(), 'u37');
      this.u39 = new MatrixOfLifeElements(this.u38.getArcane() + this.u40.getArcane(), 'u39');
      // 6 октал 40 - 48
      this.u44 = new MatrixOfLifeElements(this.u40.getArcane() + this.u48.getArcane(), 'u44');
      this.u42 = new MatrixOfLifeElements(this.u40.getArcane() + this.u44.getArcane(), 'u42');
      this.u41 = new MatrixOfLifeElements(this.u42.getArcane() + this.u40.getArcane(), 'u41');
      this.u43 = new MatrixOfLifeElements(this.u42.getArcane() + this.u44.getArcane(), 'u43');
      this.u46 = new MatrixOfLifeElements(this.u44.getArcane() + this.u48.getArcane(), 'u46');
      this.u45 = new MatrixOfLifeElements(this.u46.getArcane() + this.u44.getArcane(), 'u45');
      this.u47 = new MatrixOfLifeElements(this.u46.getArcane() + this.u48.getArcane(), 'u47');
      // 7 октал 48 - 56
      this.u52 = new MatrixOfLifeElements(this.u48.getArcane() + this.u56.getArcane(), 'u52');
      this.u50 = new MatrixOfLifeElements(this.u52.getArcane() + this.u48.getArcane(), 'u50');
      this.u49 = new MatrixOfLifeElements(this.u50.getArcane() + this.u48.getArcane(), 'u49');
      this.u51 = new MatrixOfLifeElements(this.u52.getArcane() + this.u50.getArcane(), 'u51');
      this.u54 = new MatrixOfLifeElements(this.u52.getArcane() + this.u56.getArcane(), 'u54');
      this.u53 = new MatrixOfLifeElements(this.u54.getArcane() + this.u52.getArcane(), 'u53');
      this.u55 = new MatrixOfLifeElements(this.u54.getArcane() + this.u56.getArcane(), 'u55');
      // 7 октал 56 - 0
      this.u60 = new MatrixOfLifeElements(this.u56.getArcane() + this.u00.getArcane(), 'u60');
      this.u58 = new MatrixOfLifeElements(this.u60.getArcane() + this.u56.getArcane(), 'u58');
      this.u57 = new MatrixOfLifeElements(this.u58.getArcane() + this.u56.getArcane(), 'u57');
      this.u59 = new MatrixOfLifeElements(this.u60.getArcane() + this.u58.getArcane(), 'u59');
      this.u62 = new MatrixOfLifeElements(this.u60.getArcane() + this.u00.getArcane(), 'u62');
      this.u61 = new MatrixOfLifeElements(this.u62.getArcane() + this.u60.getArcane(), 'u61');
      this.u63 = new MatrixOfLifeElements(this.u62.getArcane() + this.u00.getArcane(), 'u63');
      // внутренние
      // нумерация идёт от центра, c00 самый центра, первое число переменной - направление с u00 по часовой стрелке 
      this.c00 = new MatrixOfLifeElements(this.u00.getArcane() + this.u16.getArcane() + this.u32.getArcane() + this.u48.getArcane(), 'c00');

      this.c02 = new MatrixOfLifeElements(this.c00.getArcane() + this.u00.getArcane(), 'c02');
      this.c01 = new MatrixOfLifeElements(this.c02.getArcane() + this.c00.getArcane(), 'c01');
      this.c03 = new MatrixOfLifeElements(this.u00.getArcane() + this.c02.getArcane(), 'c03');

      this.c11 = new MatrixOfLifeElements(this.c00.getArcane() + this.u08.getArcane(), 'c11');
      this.c12 = new MatrixOfLifeElements(this.c11.getArcane() + this.u08.getArcane(), 'c12');

      this.c22 = new MatrixOfLifeElements(this.c00.getArcane() + this.u16.getArcane(), 'c22');
      this.c21 = new MatrixOfLifeElements(this.c00.getArcane() + this.c22.getArcane(), 'c21');
      this.c23 = new MatrixOfLifeElements(this.c22.getArcane() + this.u16.getArcane(), 'c23');

      this.c31 = new MatrixOfLifeElements(this.c00.getArcane() + this.u24.getArcane(), 'c31');
      this.c32 = new MatrixOfLifeElements(this.c31.getArcane() + this.u24.getArcane(), 'c32');

      this.c41 = new MatrixOfLifeElements(this.c00.getArcane() + this.u32.getArcane(), 'c41');
      this.c42 = new MatrixOfLifeElements(this.c41.getArcane() + this.u32.getArcane(), 'c42');
      
      this.c52 = new MatrixOfLifeElements(this.c00.getArcane() + this.u40.getArcane(), 'c52');
      this.c53 = new MatrixOfLifeElements(this.c52.getArcane() + this.u40.getArcane(), 'c53');

      this.c61 = new MatrixOfLifeElements(this.c00.getArcane() + this.u48.getArcane(), 'c61');
      this.c62 = new MatrixOfLifeElements(this.u48.getArcane() + this.c61.getArcane(), 'c62');
      
      this.c71 = new MatrixOfLifeElements(this.c00.getArcane() + this.u56.getArcane(), 'c71');
      this.c72 = new MatrixOfLifeElements(this.u56.getArcane() + this.c71.getArcane(), 'c72');

      this.c51 = new MatrixOfLifeElements(this.c41.getArcane() + this.c61.getArcane(), 'c51');
      this.s01 = new MatrixOfLifeElements(this.c41.getArcane() + this.c51.getArcane(), 's01');
      this.s02 = new MatrixOfLifeElements(this.c61.getArcane() + this.c51.getArcane(), 's02');
      // под таблицей
      // небо - земля 
      this.b01 = new MatrixOfLifeElements(this.u16.getArcane() + this.u48.getArcane(), 'b01');
      this.b02 = new MatrixOfLifeElements(this.u00.getArcane() + this.u32.getArcane(), 'b02');
      this.b03 = new MatrixOfLifeElements(this.b01.getArcane() + this.b02.getArcane(), 'b03');
      // мужское - женское 
      this.b04 = new MatrixOfLifeElements(this.u08.getArcane() + this.u40.getArcane(), 'b04');
      this.b05 = new MatrixOfLifeElements(this.u56.getArcane() + this.u24.getArcane(), 'b05');
      this.b06 = new MatrixOfLifeElements(this.b04.getArcane() + this.b05.getArcane(), 'b06');
      // духовное
      this.b07 = new MatrixOfLifeElements(this.b06.getArcane() + this.b03.getArcane(), 'b07');
      //таблица здоровья

      this.t11 = new MatrixOfLifeElements(this.u00.getArcane(), 't11');
      this.t12 = new MatrixOfLifeElements(this.u16.getArcane(), 't12');
      this.t13 = new MatrixOfLifeElements(this.t11.getArcane() + this.t12.getArcane(), 't13');

      this.t21 = new MatrixOfLifeElements(this.c03.getArcane(), 't21');
      this.t22 = new MatrixOfLifeElements(this.c23.getArcane(), 't22');
      this.t23 = new MatrixOfLifeElements(this.t21.getArcane() + this.t22.getArcane(), 't23');

      this.t31 = new MatrixOfLifeElements(this.c02.getArcane(), 't31');
      this.t32 = new MatrixOfLifeElements(this.c22.getArcane(), 't32');
      this.t33 = new MatrixOfLifeElements(this.t31.getArcane() + this.t32.getArcane(), 't33');

      this.t41 = new MatrixOfLifeElements(this.c01.getArcane(), 't41');
      this.t42 = new MatrixOfLifeElements(this.c21.getArcane(), 't42');
      this.t43 = new MatrixOfLifeElements(this.t41.getArcane() + this.t42.getArcane(), 't43');

      this.t51 = new MatrixOfLifeElements(this.c00.getArcane(), 't51');
      this.t52 = new MatrixOfLifeElements(this.c00.getArcane(), 't52');
      this.t53 = new MatrixOfLifeElements(this.t51.getArcane() + this.t52.getArcane(), 't53');

      this.t61 = new MatrixOfLifeElements(this.c41.getArcane(), 't61');
      this.t62 = new MatrixOfLifeElements(this.c61.getArcane(), 't62');
      this.t63 = new MatrixOfLifeElements(this.t61.getArcane() + this.t62.getArcane(), 't63');

      this.t71 = new MatrixOfLifeElements(this.u32.getArcane(), 't71');
      this.t72 = new MatrixOfLifeElements(this.u48.getArcane(), 't72');
      this.t73 = new MatrixOfLifeElements(this.t71.getArcane() + this.t72.getArcane(), 't73');

      this.t81 = new MatrixOfLifeElements(this.t11.getArcane() + this.t21.getArcane() + this.t31.getArcane() + this.t41.getArcane() + this.t51.getArcane() + this.t61.getArcane() + this.t71.getArcane(), 't81');
      this.t82 = new MatrixOfLifeElements(this.t12.getArcane() + this.t22.getArcane() + this.t32.getArcane() + this.t42.getArcane() + this.t52.getArcane() + this.t62.getArcane() + this.t72.getArcane(), 't82');
      this.t83 = new MatrixOfLifeElements(this.t81.getArcane() + this.t82.getArcane(), 't83');
      // задание соседей чтобы просматривать хвосты
      // задание пар соседних энергий
      // НЕ БРАТЬ СОСЕДЕЙ ПО ОБЕ СТОРОНЫ!!!
      this.u00.addNeighbors([[this.u01, this.u02], [this.u01], [this.c03, this.c02], [this.c03], [this.u63, this.u62], [this.u63]]);
      this.u08.addNeighbors([[this.u07, this.u06], [this.u07], [this.c12, this.c11], [this.c12], [this.u09, this.u10], [this.u09]]);
      this.u16.addNeighbors([[this.u15, this.u14], [this.u15], [this.c23, this.c22], [this.c23], [this.u17, this.u18], [this.u17]]);
      this.u24.addNeighbors([[this.u23, this.u22], [this.u23], [this.c32, this.c31], [this.c32], [this.u25, this.u26], [this.u25]]);
      this.u32.addNeighbors([[this.u31, this.u30], [this.u31], [this.c42, this.c41], [this.c42], [this.u33, this.u34], [this.u33]]);
      this.u40.addNeighbors([[this.u39, this.u38], [this.u39], [this.c53, this.c52], [this.c53], [this.u41, this.u42], [this.u41]]);
      this.u48.addNeighbors([[this.u47, this.u46], [this.u47], [this.c62, this.c61], [this.c62], [this.u49, this.u50], [this.u49]]);
      this.u56.addNeighbors([[this.u55, this.u54], [this.u55], [this.c72, this.c71], [this.c72], [this.u57, this.u58], [this.u57]]);

      this.c00.addNeighbors([[this.c01, this.c02], [this.c01], [this.c11, this.c12], [this.c11], [this.c21, this.c22], [this.c21], [this.c31, this.c32], [this.c31], [this.c41, this.c42], [this.c41], [this.c51, this.c52], [this.c51], [this.c61, this.c62], [this.c61], [this.c71, this.c72], [this.c71]]);

      this.c01.addNeighbors([[this.c02, this.c03], [this.c02], [this.c00, this.c41], [this.c00]]);
      this.c02.addNeighbors([[this.c03, this.u00], [this.c03], [this.c01, this.c00], [this.c01]]);
      this.c03.addNeighbors([[this.u00], [this.c02, this.c01], [this.c02]]);

      this.c11.addNeighbors([[this.c12, this.u08], [this.c12], [this.c00, this.c51], [this.c00]]);
      this.c12.addNeighbors([[this.u08], [this.c11, this.u08], [this.c11]]);

      this.c21.addNeighbors([[this.c22, this.c23], [this.c22], [this.c00, this.c61], [this.c00]]);
      this.c22.addNeighbors([[this.c23, this.u16], [this.c23], [this.c21, this.c00], [this.c21]]);
      this.c23.addNeighbors([[this.u16], [this.c22, this.c21], [this.c22]]);

      this.c31.addNeighbors([[this.c32, this.u24], [this.c32], [this.c00, this.c71], [this.c00]]);
      this.c32.addNeighbors([[this.u24], [this.c31, this.c00], [this.c31]]);

      this.c41.addNeighbors([[this.c42, this.u32], [this.c42], [this.c00, this.c01], [this.c00], [this.s01, this.c51], [this.s01]]);
      this.c42.addNeighbors([[this.u32], [this.c41, this.c00], [this.c41]]);
      
      this.c51.addNeighbors([[this.s02, this.c61], [this.s02], [this.s01, this.c41], [this.s01], [this.c52, this.c53], [this.c52], [this.c00, this.c11], [this.c00]]);
      this.c52.addNeighbors([[this.c53, this.u40], [this.c53], [this.c51, this.c00], [this.c51]]);
      this.c53.addNeighbors([[this.u40], [this.c52, this.c51], [this.c53]]);

      this.c61.addNeighbors([[this.c62, this.u48], [this.c62], [this.c00, this.c21], [this.c00], [this.s02, this.c51], [this.s02]]);
      this.c62.addNeighbors([[this.u48], [this.c61, this.c00], [this.c61]]);
      
      this.c71.addNeighbors([[this.c72, this.u56], [this.c72], [this.c00, this.c31], [this.c00]]);
      this.c72.addNeighbors([[this.u56], [this.c71, this.c00], [this.c71]]);

      this.s01.addNeighbors([[this.c51, this.s02], [this.c51], [this.c41]]);
      this.s02.addNeighbors([[this.c51, this.s01], [this.c51], [this.c61]]);

      this.u01.addNeighbors([[this.u00], [this.u02, this.u03], [this.u02]]);
      this.u02.addNeighbors([[this.u01, this.u00], [this.u01], [this.u03, this.u04], [this.u03]]);
      this.u03.addNeighbors([[this.u02, this.u01], [this.u02], [this.u04]]);
      this.u04.addNeighbors([[this.u03, this.u02], [this.u03], [this.u05, this.u06], [this.u05]]);
      this.u05.addNeighbors([[this.u04], [this.u06, this.u07], [this.u06]]);
      this.u06.addNeighbors([[this.u05, this.u04], [this.u05], [this.u07, this.u08], [this.u07]]);
      this.u07.addNeighbors([[this.u06, this.u05], [this.u06], [this.u08]]);
      
      this.u09.addNeighbors([[this.u08], [this.u09, this.u10], [this.u09]]);
      this.u10.addNeighbors([[this.u09, this.u08], [this.u09], [this.u11, this.u12], [this.u11]]);
      this.u11.addNeighbors([[this.u10, this.u09], [this.u10], [this.u12]]);
      this.u12.addNeighbors([[this.u11, this.u10], [this.u11], [this.u13, this.u14], [this.u13]]);
      this.u13.addNeighbors([[this.u12], [this.u14, this.u15], [this.u14]]);
      this.u14.addNeighbors([[this.u13, this.u12], [this.u13], [this.u15, this.u16], [this.u15]]);
      this.u15.addNeighbors([[this.u14, this.u13], [this.u14], [this.u16]]);

      this.u17.addNeighbors([[this.u16], [this.u18, this.u19], [this.u18]]);
      this.u18.addNeighbors([[this.u17, this.u16], [this.u17], [this.u19, this.u20], [this.u19]]);
      this.u19.addNeighbors([[this.u18, this.u17], [this.u18], [this.u20]]);
      this.u20.addNeighbors([[this.u19, this.u18], [this.u19], [this.u21, this.u22], [this.u21]]);
      this.u21.addNeighbors([[this.u20], [this.u22, this.u23], [this.u22]]);
      this.u22.addNeighbors([[this.u21, this.u20], [this.u21], [this.u23, this.u24], [this.u23]]);
      this.u23.addNeighbors([[this.u22, this.u21], [this.u22], [this.u24]]);
      
      this.u25.addNeighbors([[this.u24], [this.u26, this.u27], [this.u26]]);
      this.u26.addNeighbors([[this.u25, this.u24], [this.u25], [this.u27, this.u28], [this.u27]]);
      this.u27.addNeighbors([[this.u26, this.u25], [this.u26], [this.u28]]);
      this.u28.addNeighbors([[this.u27, this.u26], [this.u27], [this.u29, this.u30], [this.u29]]);
      this.u29.addNeighbors([[this.u28], [this.u30, this.u31], [this.u30]]);
      this.u30.addNeighbors([[this.u29, this.u28], [this.u29], [this.u31, this.u32], [this.u31]]);
      this.u31.addNeighbors([[this.u30, this.u29], [this.u30], [this.u32]]);
      
      this.u33.addNeighbors([[this.u32], [this.u34, this.u35], [this.u34]]);
      this.u34.addNeighbors([[this.u33, this.u32], [this.u33], [this.u35, this.u36], [this.u35]]);
      this.u35.addNeighbors([[this.u34, this.u33], [this.u34], [this.u36]]);
      this.u36.addNeighbors([[this.u35, this.u34], [this.u35], [this.u37, this.u38], [this.u37]]);
      this.u37.addNeighbors([[this.u36], [this.u38, this.u39], [this.u38]]);
      this.u38.addNeighbors([[this.u37, this.u36], [this.u37], [this.u39, this.u40], [this.u39]]);
      this.u39.addNeighbors([[this.u38, this.u37], [this.u38], [this.u40]]);
      
      this.u41.addNeighbors([[this.u40], [this.u42, this.u43], [this.u42]]);
      this.u42.addNeighbors([[this.u41, this.u40], [this.u41], [this.u43, this.u44], [this.u43]]);
      this.u43.addNeighbors([[this.u42, this.u41], [this.u42], [this.u44]]);
      this.u44.addNeighbors([[this.u43, this.u42], [this.u43], [this.u45, this.u46], [this.u45]]);
      this.u45.addNeighbors([[this.u44], [this.u46, this.u47], [this.u46]]);
      this.u46.addNeighbors([[this.u45, this.u44], [this.u45], [this.u47, this.u48], [this.u47]]);
      this.u47.addNeighbors([[this.u46, this.u45], [this.u46], [this.u48]]);
      
      this.u49.addNeighbors([[this.u48], [this.u50, this.u51], [this.u50]]);
      this.u50.addNeighbors([[this.u49, this.u48], [this.u49], [this.u51, this.u52], [this.u51]]);
      this.u51.addNeighbors([[this.u50, this.u49], [this.u50], [this.u52]]);
      this.u52.addNeighbors([[this.u51, this.u50], [this.u51], [this.u53, this.u54], [this.u53]]);
      this.u53.addNeighbors([[this.u52], [this.u54, this.u55], [this.u54]]);
      this.u54.addNeighbors([[this.u53, this.u52], [this.u53], [this.u55, this.u56], [this.u55]]);
      this.u55.addNeighbors([[this.u54, this.u53], [this.u54], [this.u56]]);
      
      this.u57.addNeighbors([[this.u56], [this.u58, this.u59], [this.u58]]);
      this.u58.addNeighbors([[this.u57, this.u56], [this.u57], [this.u59, this.u60], [this.u59]]);
      this.u59.addNeighbors([[this.u58, this.u57], [this.u58], [this.u60]]);
      this.u60.addNeighbors([[this.u59, this.u58], [this.u59], [this.u61, this.u62], [this.u61]]);
      this.u61.addNeighbors([[this.u60], [this.u62, this.u63], [this.u62]]);
      this.u62.addNeighbors([[this.u61, this.u60], [this.u61], [this.u63, this.u00], [this.u63]]);
      this.u63.addNeighbors([[this.u62, this.u61], [this.u62], [this.u00]]);

      this.t11.addNeighbors([[this.t12, this.t13], [this.t12]]);
      this.t12.addNeighbors([[this.t11], [this.t13]]);
      this.t13.addNeighbors([[this.t12, this.t11], [this.t12]]);
      
      this.t21.addNeighbors([[this.t22, this.t23], [this.t22]]);
      this.t22.addNeighbors([[this.t21], [this.t23]]);
      this.t23.addNeighbors([[this.t22, this.t21], [this.t22]]);
      
      this.t31.addNeighbors([[this.t32, this.t33], [this.t32]]);
      this.t32.addNeighbors([[this.t31], [this.t33]]);
      this.t33.addNeighbors([[this.t32, this.t31], [this.t32]]);
      
      this.t41.addNeighbors([[this.t42, this.t43], [this.t42]]);
      this.t42.addNeighbors([[this.t41], [this.t43]]);
      this.t43.addNeighbors([[this.t42, this.t41], [this.t42]]);
      
      this.t51.addNeighbors([[this.t52, this.t53], [this.t52]]);
      this.t52.addNeighbors([[this.t51], [this.t53]]);
      this.t53.addNeighbors([[this.t52, this.t51], [this.t52]]);
      
      this.t61.addNeighbors([[this.t62, this.t63], [this.t62]]);
      this.t62.addNeighbors([[this.t61], [this.t63]]);
      this.t63.addNeighbors([[this.t62, this.t61], [this.t62]]);
      
      this.t71.addNeighbors([[this.t72, this.t73], [this.t72]]);
      this.t72.addNeighbors([[this.t71], [this.t73]]);
      this.t73.addNeighbors([[this.t72, this.t71], [this.t72]]);
      
      this.t81.addNeighbors([[this.t82, this.t83], [this.t82]]);
      this.t82.addNeighbors([[this.t81], [this.t83]]);
      this.t83.addNeighbors([[this.t82, this.t81], [this.t82]]);

      this.tailsList = [];

      this.energyList = [];
      // // проверка энергий по каждому соседу являются ли они хвостом или проограммой
      // for (let item in this) {    // по всем элементам объекта класса
      //     if (this[item] instanceof MatrixOfLifeElements) {   // что являются объектами класса энергий
      //         this[item].getAllElements().forEach((item2) => {    // смотрим у них каждую двойку и тройку
      //             const tag = `t${item2[0].getArcane()}_${item2[1].getArcane()}${item2[2]?`_${item2[2].getArcane()}`:''}`;    // совпадают ли их числа энергий с тегами хвостов или программ
      //             if (mainTailList[tag]) { //mainTailList[tag]
      //                 this.tailsList.push(new MatrixOfLifeTails(item2[0].id, item2[2] ? item2[2].id : item2[1].id, tag)); // если да, то добавляем их в список хвостов
      //             }
      //         });
      //     }
      // }
      
      this.energyList.forEach((item) => {
          
      });
  }
}
//класс хвостов и программ
class MatrixOfLifeTails {
  constructor(startElement, endElement, tag) {
      //продумать как хранить энергии внутри хвоста
      if (startElement.split('')[0] == 't') {
          this.DOMtail = document.querySelector(`#${startElement}`).parentNode;
          this.DOMtail.classList.add('tail-t');
      } else {
          this.DOMtail = document.querySelector(`.${startElement}.${endElement}`);
          this.DOMtail.classList.add('show');
      }
      
      this.DOMtail.addEventListener("click", () => {
          // call ann window 
      });
  }
}
// класс энергий
class MatrixOfLifeElements {
  constructor(number, id) {
      this.arcane = splitAndAdd(number);
      this.neighborPairList = [];
  }
  addNeighbors = (list) => {
      list.forEach((item) => {
          this.neighborPairList.push(item);
      });
  }
  getArcane = () => {
      return this.arcane;
  }
  // возвращает список из списка соседей тройняшек или двойняшек класса MatrixOfLifeElements 
  getAllElements = () => {
      return this.neighborPairList.map((item) => {return item[1]?[this, item[0], item[1]] : [ this, item[0]]});
  }
}