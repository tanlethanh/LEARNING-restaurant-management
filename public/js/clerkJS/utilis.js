const stateMap = {
   'unorder': 'Chưa gọi',
   'ordered': 'Đã gọi',
   'paid': 'Đã thanh toán'
}

function fillTableInfo(tableData) {
   let tableName = document.getElementById('tableName');
   let group = document.getElementById('group');
   let dinein = document.getElementById('dinein');
   let state = document.getElementById('state');

   tableName.innerHTML = 'Bàn ' + tableData.num;

   let groupNum = document.createElement('span')
   groupNum.innerHTML = tableData.group;
   group.appendChild(groupNum)

   dinein.innerHTML = "Vào bàn | " + tableData.dineIn;

   state.innerHTML = stateMap[tableData.state];
   state.parentNode.classList.add(tableData.state);
}

function numberWithDot(x) {
   return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}