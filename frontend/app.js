async function fetchItems() {
  const res = await fetch('http://localhost:3002/items');
  const items = await res.json();
  const ul = document.getElementById('items');
  ul.innerHTML = '';
  items.forEach(item => {
    const li = document.createElement('li');
    li.className = 'flex items-center justify-between p-3 bg-white border rounded-lg shadow-sm';
    
    // Item name
    const span = document.createElement('span');
    span.textContent = item.name;
    span.className = 'font-medium text-gray-700';
    li.appendChild(span);
    
    // Buttons container
    const btnContainer = document.createElement('div');
    btnContainer.className = 'flex gap-2';
    
    // Edit button
    const edit = document.createElement('button');
    edit.textContent = 'Edit';
    edit.className = 'bg-primary hover:bg-blue-600 text-white px-3 py-1 rounded text-sm transition-colors';
    edit.onclick = (e) => { e.stopPropagation(); updateItem(item.id); };
    btnContainer.appendChild(edit);
    
    // Delete button
    const del = document.createElement('button');
    del.textContent = 'Delete';
    del.className = 'bg-danger hover:bg-red-500 text-white px-3 py-1 rounded text-sm transition-colors';
    del.onclick = (e) => { e.stopPropagation(); deleteItem(item.id); };
    btnContainer.appendChild(del);
    
    li.appendChild(btnContainer);
    ul.appendChild(li);
  });
}

async function createItem() {
  const name = document.getElementById('newItem').value;
  await fetch('http://localhost:3002/items', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name })
  });
  fetchItems();
}

async function updateItem(id) {
  const name = prompt('New name:');
  if (name) {
    await fetch(`http://localhost:3002/items/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name })
    });
    fetchItems();
  }
}

async function deleteItem(id) {
  await fetch(`http://localhost:3002/items/${id}`, { method: 'DELETE' });
  fetchItems();
}

fetchItems();