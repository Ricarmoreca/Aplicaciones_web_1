const Register = {
    template: `
        <div>
            <h1>REGISTRO DE USUARIO</h1>
            <form @submit.prevent="handleRegister">
                <div class="campos_registro">
                    <label for="nombres">Nombre completo:</label><br>
                    <input v-model="form.name" type="text" id="nombres" required><br>
                    
                    <label for="correo">Correo Institucional:</label><br>
                    <input v-model="form.email" type="email" id="correo" required><br>

                    <label for="rol">Rol del usuario:</label><br>
                    <select v-model="form.rol" id="rol" required>
                        <option value="" disabled>Seleccione rol</option>
                        <option value="estudiante">Estudiante</option>
                        <option value="docente">Docente</option>
                        <option value="administrador">Administrador</option>
                    </select><br>

                    <label for="contraseña">Contraseña:</label><br>
                    <input v-model="form.password" type="password" id="contraseña" required><br>

                    <label for="confirmar">Confirmar contraseña:</label><br>
                    <input v-model="form.confirmPassword" type="password" id="confirmar" required><br>
                </div>

                <div v-if="error" class="error-message">{{ error }}</div>

                <div class="acciones_registro">
                    <input type="submit" value="Registrarse"><br><br>
                </div>

                <div class="links_registro">
                    <router-link to="/login">¿Ya tiene una cuenta? Inicie sesión</router-link><br><br>
                </div>
            </form>
        </div>
    `,
    data() {
        return {
            form: { name: '', email: '', rol: '', password: '', confirmPassword: '' },
            error: ''
        };
    },
    methods: {
        async handleRegister() {
            this.error = '';
            const nameVal = (this.form.name || '').trim();
            const correoVal = (this.form.email || '').trim().toLowerCase();
            const rolVal = (this.form.rol || '').trim().toLowerCase();
            const passVal = (this.form.password || '').trim();
            const confirmVal = (this.form.confirmPassword || '').trim();

            if (!nameVal || !correoVal || !rolVal || !passVal || !confirmVal) {
                this.error = 'Por favor, complete todos los campos.';
                return;
            }

            const uleamRe = /^[^\s@]+@(?:live\.)?uleam\.edu\.ec$/i;
            if (!uleamRe.test(correoVal)) {
                this.error = 'Por favor, ingrese su correo institucional de la ULEAM (ej: usuario@uleam.edu.ec o usuario@live.uleam.edu.ec).';
                return;
            }

            if (passVal !== confirmVal) {
                this.error = 'Las contraseñas no coinciden. Por favor verifique.';
                return;
            }

            const users = JSON.parse(localStorage.getItem('users') || '[]');
            if (users.find(u => (u.email || '').toLowerCase() === correoVal)) {
                this.error = 'El correo ya está registrado.';
                return;
            }

            const passHash = await Utils.hashSHA256(passVal);
            const newUser = {
                email: correoVal,
                name: nameVal,
                rol: rolVal,
                passwordHash: passHash
            };
            users.push(newUser);
            localStorage.setItem('users', JSON.stringify(users));

            localStorage.setItem('session', JSON.stringify({ 
                email: correoVal, 
                name: nameVal, 
                rol: rolVal 
            }));

            alert('¡Registro exitoso! Será redirigido a su panel.');
            const role = rolVal.toLowerCase();
            if (role === 'administrador') {
                this.$router.push('/dashboard');
            } else {
                this.$router.push('/publications');
            }
        }
    }
};