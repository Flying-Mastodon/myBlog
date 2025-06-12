async function loadAnalytics() {
  try {
    const res = await fetch('https://myblog-sy0j.onrender.com/api/analytics');
    const data = await res.json();

    const osCounts = {};
    const countryCounts = {};
    const ispCounts = {};
    const tableBody = document.getElementById('log-table-body');

    tableBody.innerHTML = '';

    data.forEach(entry => {
      const os = entry.os || 'Unknown';
      const country = entry.country || 'Unknown';
      const isp = entry.isp || 'Unknown';

      osCounts[os] = (osCounts[os] || 0) + 1;
      countryCounts[country] = (countryCounts[country] || 0) + 1;
      ispCounts[isp] = (ispCounts[isp] || 0) + 1;

      const row = `
        <tr>
          <td>${entry.ip_address || 'N/A'}</td>
          <td>${os}</td>
          <td>${country}</td>
          <td>${isp}</td>
          <td>${new Date(entry.created_at).toLocaleString('en-GB')}</td>
        </tr>
      `;
      tableBody.insertAdjacentHTML('beforeend', row);
    });

    renderChart('osChart', 'OS Usage', osCounts);
    renderChart('countryChart', 'Visits by Country', countryCounts);
    renderChart('ispChart', 'ISPs', ispCounts);

  } catch (err) {
    console.error('Error loading analytics:', err);
  }
}

function renderChart(canvasId, label, data) {
  const canvas = document.getElementById(canvasId);
  
  // Wrap canvas in a div if not already wrapped
  if (!canvas.parentElement.classList.contains('chart-wrapper')) {
    const wrapper = document.createElement('div');
    wrapper.classList.add('chart-wrapper');
    canvas.parentNode.insertBefore(wrapper, canvas);
    wrapper.appendChild(canvas);
  }

  const ctx = canvas.getContext('2d');

  new Chart(ctx, {
    type: 'pie',
    data: {
      labels: Object.keys(data),
      datasets: [{
        label,
        data: Object.values(data),
        backgroundColor: [
          '#3b82f6', '#10b981', '#f59e0b', '#ef4444',
          '#8b5cf6', '#ec4899', '#f97316', '#22d3ee',
          '#6366f1', '#14b8a6'
        ]
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'bottom'
        }
      }
    }
  });
}

loadAnalytics();
