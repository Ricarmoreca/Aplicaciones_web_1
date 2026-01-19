const Query = {
    template: `
        <div>
            <h1>Buscar publicaciones</h1>

            <div class="controls">
                <input 
                    v-model="searchTerm" 
                    type="text" 
                    id="searchInput" 
                    placeholder="Buscar por título, autor o palabra clave" 
                    style="flex:1;min-width:220px"
                >
                <select v-model="selectedType" id="typeFilter">
                    <option value="">Filtrar por tipo (todos)</option>
                    <option v-for="type in types" :key="type" :value="type">{{ type }}</option>
                </select>
                <select v-model="selectedYear" id="yearFilter">
                    <option value="">Filtrar por año (todos)</option>
                    <option v-for="year in years" :key="year" :value="year">{{ year }}</option>
                </select>
                <button @click="clearFilters" id="clearBtn">Limpiar</button>
            </div>

            <div id="counts" class="small">
                Resultados: {{ filtered.length }} — Totales en sistema: {{ publications.length }}
            </div>

            <div id="results">
                <table v-if="!isMobile" id="resultsTable">
                    <thead>
                        <tr>
                            <th>Título</th>
                            <th>Autores</th>
                            <th>Tipo</th>
                            <th>Año</th>
                            <th>Estado</th>
                            <th>Enlaces</th>
                        </tr>
                    </thead>
                    <tbody id="resultsBody">
                        <tr v-for="pub in filtered" :key="pub.id" :data-id="pub.id">
                            <td>{{ pub.title }}</td>
                            <td>{{ pub.authors }}</td>
                            <td>{{ pub.type || '' }}</td>
                            <td>{{ pub.date ? pub.date.slice(0, 4) : '' }}</td>
                            <td>{{ pub.status || '' }}</td>
                            <td class="links">
                                <a v-if="pub.doi" :href="pub.doi" target="_blank">DOI/Enlace</a>
                                <a v-if="pub.pdfData" :href="pub.pdfData" :download="getPDFName(pub)">PDF</a>
                            </td>
                        </tr>
                    </tbody>
                </table>

                <div v-else id="resultsCards" style="display:block">
                    <div v-for="pub in filtered" :key="pub.id" class="card" :data-id="pub.id">
                        <h3>{{ pub.title }}</h3>
                        <p><strong>Autores:</strong> {{ pub.authors }}</p>
                        <p><strong>Tipo:</strong> {{ pub.type || '' }} — <strong>Año:</strong> {{ pub.date ? pub.date.slice(0, 4) : '' }}</p>
                        <p><strong>Estado:</strong> {{ pub.status || '' }}</p>
                        <p class="links">
                            <a v-if="pub.doi" :href="pub.doi" target="_blank">DOI/Enlace</a>
                            <a v-if="pub.pdfData" :href="pub.pdfData" :download="getPDFName(pub)">PDF</a>
                        </p>
                    </div>
                </div>

                <div v-if="filtered.length === 0" id="noData" class="no-data">No se encontraron publicaciones.</div>
            </div>
        </div>
    `,
    data() {
        return {
            publications: [],
            searchTerm: '',
            selectedType: '',
            selectedYear: '',
            isMobile: window.innerWidth <= 700
        };
    },
    computed: {
        types() {
            const s = new Set(this.publications.map(p => p.type).filter(t => t));
            return Array.from(s).sort();
        },
        years() {
            const s = new Set(this.publications.map(p => p.date ? p.date.slice(0, 4) : null).filter(y => y));
            return Array.from(s).sort().reverse();
        },
        filtered() {
            return this.publications.filter(pub => {
                const term = (this.searchTerm || '').toLowerCase();
                if (term && !(pub.title + ' ' + pub.authors + ' ' + (pub.type || '')).toLowerCase().includes(term)) {
                    return false;
                }
                if (this.selectedType && (pub.type || '') !== this.selectedType) {
                    return false;
                }
                if (this.selectedYear && (pub.date ? pub.date.slice(0, 4) : '') !== this.selectedYear) {
                    return false;
                }
                return true;
            });
        }
    },
    methods: {
        loadPublications() {
            this.publications = JSON.parse(localStorage.getItem('publications') || '[]');
        },
        clearFilters() {
            this.searchTerm = '';
            this.selectedType = '';
            this.selectedYear = '';
        },
        getPDFName(pub) {
            return (pub.title || 'publicacion').replace(/[^a-z0-9\-]/gi, '_') + '.pdf';
        }
    },
    mounted() {
        this.loadPublications();
        window.addEventListener('resize', () => {
            this.isMobile = window.innerWidth <= 700;
        });
        window.addEventListener('storage', () => this.loadPublications());
    }
};