"use strict";

new Vue({
  el: '#app',
  data: {
    name: '',
    date: "2020-06-12",
    saves: localStorage.saves ? JSON.parse(localStorage.saves) : [],
    savesListDisplay: false,
    deleteMode: false
  },
  methods: {
    changeMatrix: function (newMatrix) {
      if (!this.deleteMode) {
        this.date = newMatrix;
        this.dateValue = newMatrix;
        this.savesListDisplay = false;
      }
    },
    calculate: function () {
      if (this.date != undefined || this.name != '') {
        this.saves.push({
          date: this.date,
          name: this.name
        });
        localStorage.saves = JSON.stringify(this.saves);
      } else {
        alert('Введено неверное имя или дата!')
      }
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
})