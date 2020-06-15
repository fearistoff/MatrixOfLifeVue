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
try {
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
    },
    splitAndAdd: function (inNumber) {
      const countOfEnegries = 22;
      let newNumber;
      if (inNumber <= countOfEnegries) {
          return inNumber;
      } else if (inNumber > 999) newNumber = Math.floor(inNumber/1000) + Math.floor((inNumber/100)%10) + Math.floor((inNumber/10)%10) + Math.floor(inNumber%10);
      else if (inNumber > 99) newNumber = Math.floor((inNumber/100)%10) + Math.floor((inNumber/10)%10) + Math.floor(inNumber%10);
      else newNumber = Math.floor((inNumber/10)%10) + Math.floor(inNumber%10);
      return splitAndAdd(newNumber);
    }
  }
});
} catch (err){
  alert(err)
}