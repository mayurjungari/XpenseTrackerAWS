document.getElementById('download').style.display = 'none';
function setpagecount(e){
  e.preventDefault();
  const perpage=localStorage.setItem('perpage',document.getElementById('perpage').value)
  window.location.reload();

}


function parseJwt(token) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error parsing JWT:', error);
    return null;
  }
}
//----------showLeaderBoard fnction








function SaveData(event)
{
    
        event.preventDefault();
        const category = document.getElementById('category').value;
        const description = document.getElementById('description').value;
        const amount = document.getElementById('amount').value;
        
          const token=localStorage.getItem('token')
        axios.post('/expense/savedata', { category, description, amount }, {
          headers: {
            'Authorization': token
            
          }})
            .then( (response)=> {
                alert('Data saved successfully');
                window.location.reload();
               
            })
            .catch( (error)=> {
                console.error(error);
                alert('An error occurred. Please try again.');
            });
    }

    //----------------------------------------------------------------------------------------------
    document.addEventListener('DOMContentLoaded', async function () { 
      const page=1;
      
      
      try {
       pagecount=localStorage.getItem('perpage')||10
        
        const data = await fetchData(page,pagecount); 
        showTable(data.data)
        showPagination(data.pagination)
        handlePremiumMembership(data);
        
      } catch (error) {
        console.error(error);
        alert('An error occurred while retrieving data');
      }
    });
    //===================================================================================================================
    
    function showTable(data) {
      const tableBody = document.getElementById('tbody');
    
      tableBody.innerHTML = '';
        (data).forEach((item) => {
      const row = document.createElement('tr');
      const categoryCell = document.createElement('td');
      categoryCell.textContent = item.CATEGORY;
      const descriptionCell = document.createElement('td');
      descriptionCell.textContent = item.DESCRIPTION;
      const amountCell = document.createElement('td');
      amountCell.textContent = item.AMOUNT;
      const statusCell = document.createElement('td');
      const deleteButton = document.createElement('button');
      deleteButton.textContent = 'Delete';
      deleteButton.addEventListener('click', function () {
        handleDeleteItem(item.ID, row);
      });
      statusCell.appendChild(deleteButton);
      row.appendChild(categoryCell);
      row.appendChild(descriptionCell);
      row.appendChild(amountCell);
      row.appendChild(statusCell);
      tableBody.appendChild(row);
      
    })
  }
    
    function handleDeleteItem(itemId, row) {
      fetch(`/expense/deleteData/${itemId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: localStorage.getItem('token'),
        },
      })
        .then((response) => {
          alert('Row deleted successfully');
          row.remove();
        })
        .catch((error) => {
          console.error(error);
          alert('An error occurred while deleting the row. Please try again.');
        });
    }
    
    function handlePremiumMembership(data) {
      const token = localStorage.getItem('token');
      const tokenObject = parseJwt(token);
      if (tokenObject.isPremium === true) {
        const premiumButton = document.getElementById('buypremium');
        premiumButton.style.display = 'none';
        const paradiv = document.getElementById('paradiv');
        const para = document.createElement('p');
        para.textContent = 'Premium Membership';
        para.style.color = 'green';
        para.style.fontWeight = 'bold';
        paradiv.appendChild(para);
        document.getElementById('LB').style.display = 'block';
        document.getElementById('download').style.display = 'block';
      }
      else{
        document.getElementById('LB').style.display = 'none';
      }
    }

    async function fetchData(page,pagecount)
    {
      const token = localStorage.getItem('token');
      const response = await fetch(`/expense/allData?page=${page}&perpage=${pagecount}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
      });
      const data = await response.json();
      return data;
    }

    async function showPagination(data) {
      const pagecount=localStorage.getItem('perpage')
      const pagediv = document.getElementById('pagenation');
      pagediv.innerHTML = '';
    
      if (data.hasPrevious) {
        const pbtn = document.createElement('button');
        pbtn.innerHTML = data.currentPage - 1;
        pbtn.addEventListener('click', async () => {
          const newData = await fetchData(data.currentPage - 1,pagecount);
          showTable(newData.data);
          showPagination(newData.pagination);
        });
        pagediv.appendChild(pbtn);
      }
    
      const cbtn = document.createElement('button');
      cbtn.innerHTML = data.currentPage;
      cbtn.addEventListener('click', async () => {
        const newData = await fetchData(data.currentPage,pagecount);
        showTable(newData.data);
        showPagination(newData.pagination);
      });
      pagediv.appendChild(cbtn);
    
      if (data.hasNext) {
        const nbtn = document.createElement('button');
        nbtn.innerHTML = data.currentPage + 1;
        nbtn.addEventListener('click', async () => {
          const newData = await fetchData(data.currentPage + 1,pagecount);
          showTable(newData.data);
          showPagination(newData.pagination);
        });
        pagediv.appendChild(nbtn);
      }
    }
    
      

//------------------------------------------------------------------------------------------------ 

if (document.getElementById('buypremium'))

{
  document.getElementById('buypremium').onclick = async (e) => {
        try{
        let token = localStorage.getItem('token');
        const response = await axios.get('purchase/premiummembership', {
          headers: { "Authorization": token }
        });
        //------------------------------------------------------------------------------
        console.log(response);
      
        var options = {
          key: 'rzp_test_l8Qgv3sCDGg8Cr',
          amount: response.data.order.amount, 
          currency: response.data.order.currency, 
          order_id: response.data.order.id,
          name: 'MJ5',
          description: 'Premium Plan',
         handler: async function (response) {
            try {
              console.log(response)
              const resp=await axios.post('purchase/premiummembership/updatestatus', {
                order_id: options.order_id,
                payment_id: response.razorpay_payment_id,
                status:'Success',
              }, {
                headers: {
                  "Authorization": token
                }
              });
               token=resp.data.token;
              localStorage.setItem('token',token)
              alert('You are now a premium member');
              window.location.reload();  
            } catch (error) {
              console.error(error);
            }
          }
        };
      
    
        const rzp1 = new Razorpay(options);

        rzp1.on('payment.failed',async function (response) {
          console.log(response)
          await axios.post('purchase/premiummembership/updatestatus', {
            order_id: options.order_id,
            payment_id: response.error.metadata.payment_id,
            status:'Failed',
          }, {
            headers: {
              "Authorization": token
            }
          });
          alert('Payment Failed: ' + response.error.description);
        });

       

        rzp1.open();  
      } 
      catch (error) {
        console.error(error);
      }
    }

}


 
  
if( document.getElementById('LB'))
{ 
  
  document.getElementById('LB').onclick = async (e) => {
  e.preventDefault();
  
  const token = localStorage.getItem('token');

  try {
       window.location.href='/showLeaderBoard'
   
  } catch (error) {
      console.error('Error:', error);
  }
};


}

//---------------------------------------------------------------------------------------------------------
document.getElementById('download').onclick = async (e) => {
  e.preventDefault();
  try {
      const token = localStorage.getItem('token'); 
      const config = {
          headers: { 'Authorization':  token }
      };

      const response = await axios.get('download', config);
    
      window.location.href=response.data.fileURL
  } catch (error) {
      console.error('Error:', error);
  }
};
  