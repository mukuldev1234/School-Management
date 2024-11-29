const API_BASE_URL = 'http://localhost:3000'; // Update with your backend URL

// Handle Add School Form Submission
document.getElementById('add-school-form').addEventListener('submit', async (event) => {
  event.preventDefault();

  const name = document.getElementById('school-name').value;
  const address = document.getElementById('school-address').value;
  const latitude = parseFloat(document.getElementById('school-lat').value);
  const longitude = parseFloat(document.getElementById('school-lng').value);

  try {
    const response = await fetch(`${API_BASE_URL}/addSchool`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, address, latitude, longitude }),
    });

    const result = await response.json();
    if (response.ok) {
      alert('School added successfully!');
      document.getElementById('add-school-form').reset();
    } else {
      alert(`Error: ${result.error}`);
    }
  } catch (error) {
    console.error('Error adding school:', error);
    alert('Error adding school. Please try again.');
  }
});

// Handle Fetch Schools Form Submission
document.getElementById('fetch-schools-form').addEventListener('submit', async (event) => {
  event.preventDefault();

  const latitude = parseFloat(document.getElementById('user-lat').value);
  const longitude = parseFloat(document.getElementById('user-lng').value);

  try {
    const response = await fetch(`${API_BASE_URL}/listSchools?latitude=${latitude}&longitude=${longitude}`);
    const schools = await response.json();

    if (response.ok) {
      const schoolsList = document.getElementById('schools-list');
      schoolsList.innerHTML = ''; // Clear the list
      schools.forEach((school) => {
        const li = document.createElement('li');
        li.textContent = `${school.name} - ${school.address} (Distance: ${school.distance.toFixed(2)} miles)`;
        schoolsList.appendChild(li);
      });
    } else {
      alert('Error fetching schools. Please try again.');
    }
  } catch (error) {
    console.error('Error fetching schools:', error);
    alert('Error fetching schools. Please try again.');
  }
});
