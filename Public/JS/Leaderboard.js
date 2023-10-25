const tbody = document.getElementById('m');



function showDataLeaderBoard(response) {
  
    

    
        response.forEach((user, i) => {
            const row = document.createElement('tr');

            const rankCell = document.createElement('td');
            rankCell.textContent = i + 1;
            row.appendChild(rankCell);

            const nameCell = document.createElement('td');
            nameCell.textContent = user.USERNAME;
            row.appendChild(nameCell);

            const totalExpenseCell = document.createElement('td');
            totalExpenseCell.textContent = `${user.TotalExpense || 0} Rs`;
            row.appendChild(totalExpenseCell);

            tbody.appendChild(row);
        });
    }
   


async function  Refresh(){
    const token = localStorage.getItem('token');

try {
    const response = await axios.get('/purchase/leaderBoard', {
        headers: { Authorization: token }
    });

  
    showDataLeaderBoard(response.data.userAgregate);
} catch (error) {
    console.error('Error:', error);
}
}
Refresh();