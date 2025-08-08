let adminToken = null;

document.getElementById('admin-login-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    try {
        const res = await fetch('http://localhost:3000/api/admin/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        const data = await res.json();
        if (res.ok && data.data && data.data.token) {
            adminToken = data.data.token;
            document.getElementById('admin-login-section').style.display = 'none';
            document.getElementById('admin-panel-section').style.display = 'block';
            loadAdminPanel();
        } else {
            document.getElementById('admin-login-error').textContent = data.message || 'Login inválido';
        }
    } catch (err) {
        document.getElementById('admin-login-error').textContent = 'Erro de conexão';
    }
});

document.getElementById('logout-btn').addEventListener('click', function() {
    adminToken = null;
    document.getElementById('admin-panel-section').style.display = 'none';
    document.getElementById('admin-login-section').style.display = 'block';
});

async function loadAdminPanel() {
    // Estatísticas
    try {
        const estatRes = await fetch('http://localhost:3000/api/admin/estatisticas', {
            headers: { 'Authorization': `Bearer ${adminToken}` }
        });
        const estatData = await estatRes.json();
        if (estatRes.ok && estatData.data) {
            const stats = estatData.data;
            let hoje = new Date().toISOString().slice(0,10);
            let topDates = Array.isArray(stats.datasComMaisReservas)
                ? stats.datasComMaisReservas.filter(d => (d.dataISO || d.data) >= hoje).slice(0,3)
                : [];
            document.getElementById('estatisticas').innerHTML = `
                <div class="stats-container">
                    <div class="stat-card">
                        <i class="fas fa-calendar-day"></i>
                        <h3>Reservas Hoje</h3>
                        <p>${stats.reservasHoje || 0}</p>
                    </div>
                    <div class="stat-card">
                        <i class="fas fa-calendar-week"></i>
                        <h3>Total Reservas</h3>
                        <p>${stats.totalReservas || 0}</p>
                    </div>
                    <div class="stat-card">
                        <i class="fas fa-users"></i>
                        <h3>Top 3 Datas com Mais Reservas</h3>
                        <ul style="list-style:none;padding:0;margin:0;">
                            ${topDates.length > 0 ? topDates.map(d => `<li>${d.data}: ${d.total}</li>`).join('') : '<li>-</li>'}
                        </ul>
                    </div>
                </div>
            `;
        } else {
            document.getElementById('estatisticas').innerHTML = `<div class="error-message">${estatData.message || 'Erro ao carregar estatísticas'}</div>`;
        }
    } catch (err) {
        document.getElementById('estatisticas').innerHTML = '<div class="error-message">Erro de conexão</div>';
    }

    // Filtro de reservas
    let reservasCache = [];
    let filtroAtual = 'today';
    function renderReservas(reservas, tipo) {
        let titulo = 'Reservas';
        if (tipo === 'today') titulo = 'Reservas de hoje';
        else if (tipo === 'all') titulo = 'Reservas ativas';
        else if (tipo === 'expired') titulo = 'Reservas expiradas';
        if (!Array.isArray(reservas) || reservas.length === 0) {
            document.getElementById('reservas-list').innerHTML = `<div class="no-reservations"><i class="fas fa-inbox"></i><p>Nenhuma reserva encontrada</p></div>`;
            return;
        }
        document.getElementById('reservas-list').innerHTML = `
            <h3><i class="fas fa-list"></i> ${titulo}</h3>
            <div class="reservations-list">
                ${reservas.map(r => `
                    <div class="reservation-item">
                        <div class="reservation-header">
                            <span class="reservation-name">${r.nome}</span>
                            <span class="reservation-date">${r.data}</span>
                        </div>
                        <div class="reservation-details">
                            <div class="detail-item">
                                <span class="detail-label">CPF</span>
                                <span class="detail-value">${r.cpf}</span>
                            </div>
                            <div class="detail-item">
                                <span class="detail-label">Telefone</span>
                                <span class="detail-value">${r.celular}</span>
                            </div>
                            <div class="detail-item">
                                <span class="detail-label">Pessoas</span>
                                <span class="detail-value">${r.quantidadePessoas}</span>
                            </div>
                            <div class="detail-item">
                                <span class="detail-label">Criado em</span>
                                <span class="detail-value">${r.createdAt ? new Date(r.createdAt).toLocaleString('pt-BR') : 'N/A'}</span>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    function filtrarReservas(tipo) {
        let hoje = new Date().toISOString().slice(0,10);
        let reservasFiltradas = reservasCache;
        if (tipo === 'today') {
            reservasFiltradas = reservasCache.filter(r => r.dataISO === hoje);
        } else if (tipo === 'all') {
            // Reservas ativas: dataISO >= hoje
            reservasFiltradas = reservasCache.filter(r => r.dataISO >= hoje);
        } else if (tipo === 'expired') {
            // Reservas expiradas: dataISO < hoje
            reservasFiltradas = reservasCache.filter(r => r.dataISO < hoje);
        }
        renderReservas(reservasFiltradas, tipo);
    }

    // Reservas
    try {
        const resRes = await fetch('http://localhost:3000/api/admin/reservas', {
            headers: { 'Authorization': `Bearer ${adminToken}` }
        });
        const resData = await resRes.json();
        if (resRes.ok && resData.data && Array.isArray(resData.data.reservas)) {
            reservasCache = resData.data.reservas;
            filtrarReservas(filtroAtual);
            // Adiciona listeners aos filtros (garante que sejam adicionados após renderização)
            setTimeout(() => {
                document.getElementById('filter-all').onclick = function() {
                    filtroAtual = 'all';
                    setActiveFilter('filter-all');
                    filtrarReservas('all');
                };
                document.getElementById('filter-today').onclick = function() {
                    filtroAtual = 'today';
                    setActiveFilter('filter-today');
                    filtrarReservas('today');
                };
                document.getElementById('filter-expired').onclick = function() {
                    filtroAtual = 'expired';
                    setActiveFilter('filter-expired');
                    filtrarReservas('expired');
                };
                function setActiveFilter(id) {
                    document.getElementById('filter-all').classList.remove('active');
                    document.getElementById('filter-today').classList.remove('active');
                    document.getElementById('filter-expired').classList.remove('active');
                    document.getElementById(id).classList.add('active');
                }
            }, 0);
        } else {
            document.getElementById('reservas-list').innerHTML = `<div class="error-message">${resData.message || 'Erro ao carregar reservas'}</div>`;
        }
    } catch (err) {
        document.getElementById('reservas-list').innerHTML = '<div class="error-message">Erro de conexão</div>';
    }
}