const RegisterPublication = {
    template: `
        <div>
            <h1>Registrar Nueva Publicación</h1>
            <form @submit.prevent="handleSubmit" id="formPublicacion">
                <div class="Titulo_publicacion">
                    <label for="Titulo">Título de la publicación:</label><br>
                    <input v-model="form.title" type="text" id="Titulo" required><br>
                </div>

                <div class="Autores">
                    <label for="Autor">Autor/autores:</label><br>
                    <input v-model="form.authors" type="text" id="Autor" required><br>
                </div>

                <div class="Tipo_publicacion">
                    <label for="Tipo">Tipo de publicación:</label><br>
                    <select v-model="form.type" id="Tipo" required>
                        <option value="" disabled>Seleccione tipo</option>
                        <option value="libro">Libro</option>
                        <option value="artículo">Artículo</option>
                        <option value="tesis">Tesis</option>
                        <option value="ponencia">Ponencia</option>
                    </select><br>
                </div>

                <div class="Fecha_publicacion">
                    <label for="Fecha">Fecha de publicación:</label><br>
                    <input v-model="form.date" type="date" id="Fecha" required><br>
                </div>

                <div class="DOI_enlace">
                    <label for="doi">DOI o enlace (URL):</label><br>
                    <input
                        v-model="form.doi"
                        type="text"
                        id="doi"
                        placeholder="https://doi.org/10.1234/ejemplo o 10.1234/ejemplo"
                    ><br>
                </div>

                <div class="PDF_archivo">
                    <label for="pdf">Archivo PDF (opcional, máximo 5 MB):</label><br>
                    <input @change="handleFileUpload" type="file" id="pdf" accept="application/pdf"><br>
                </div>

                <div v-if="error" class="notification error">{{ error }}</div>
                <div v-if="success" class="notification">{{ success }}</div>

                <div class="acciones_registro">
                    <input type="submit" value="Registrar publicación"><br><br>
                </div>
            </form>
        </div>
    `,
    data() {
        return {
            form: {
                title: '',
                authors: '',
                type: '',
                date: '',
                doi: '',
                pdfData: null
            },
            error: '',
            success: '',
            MAX_PDF_SIZE: 5 * 1024 * 1024
        };
    },
    methods: {
        handleFileUpload(e) {
            const file = e.target.files[0];
            if (!file) return;

            if (file.size > this.MAX_PDF_SIZE) {
                this.error = 'Archivo demasiado grande (máximo 5 MB).';
                return;
            }

            Utils.fileToDataURL(file)
                .then(data => {
                    this.form.pdfData = data;
                    this.error = '';
                })
                .catch(err => {
                    this.error = 'Error leyendo el PDF.';
                });
        },
        async handleSubmit() {
            this.error = '';
            this.success = '';

            const { title, authors, type, date } = this.form;
            if (!title || !authors || !type || !date) {
                this.error = 'Complete todos los campos.';
                return;
            }

            let doiVal = (this.form.doi || '').trim();
            if (doiVal) {
                if (/^10\.\d{4,9}\/\S+$/i.test(doiVal)) {
                    doiVal = 'https://doi.org/' + doiVal;
                } else if (!/^https?:\/\//i.test(doiVal)) {
                    this.error = 'Ingrese una URL válida o DOI.';
                    return;
                }
            } else {
                doiVal = null;
            }

            const session = JSON.parse(localStorage.getItem('session') || 'null');
            if (!session || (session.rol.toLowerCase() !== 'docente' && session.rol.toLowerCase() !== 'administrador' && session.rol.toLowerCase() !== 'administrativo')) {
                this.error = 'Solo docentes o administradores pueden crear publicaciones.';
                return;
            }

            const publications = JSON.parse(localStorage.getItem('publications') || '[]');
            const newPub = {
                id: Date.now(),
                title: title,
                authors: authors,
                type: type,
                date: date,
                doi: doiVal,
                pdfData: this.form.pdfData,
                abstract: '',
                status: 'en_revision',
                createdBy: session.email,
                createdByName: session.name,
                createdAt: new Date().toISOString(),
                approvedBy: null,
                approvedAt: null
            };

            publications.push(newPub);
            localStorage.setItem('publications', JSON.stringify(publications));

            this.success = '✅ Publicación registrada y enviada a revisión.';
            setTimeout(() => {
                if (session.rol.toLowerCase() === 'administrador' || session.rol.toLowerCase() === 'administrativo') {
                    this.$router.push('/review');
                } else {
                    this.$router.push('/publications');
                }
            }, 1500);
        }
    },
    mounted() {
        const session = JSON.parse(localStorage.getItem('session') || 'null');
        if (!session) {
            this.$router.push('/login');
        }
    }
};