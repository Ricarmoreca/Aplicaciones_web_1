const Login = {
    template: `
        <div>
            <h1>INICIAR SESIÓN</h1>

            <form @submit.prevent="handleLogin">
                <div class="campos_inicio_sesion">
                    <label for="correo">Correo Institucional:</label><br>
                    <input v-model="form.email" type="email" id="correo" required><br>

                    <label for="contraseña">Contraseña:</label><br>
                    <input v-model="form.password" type="password" id="contraseña" required><br>
                </div>

                <div v-if="error" class="error-message">{{ error }}</div>

                <div class="acciones_inicio_sesion">
                    <input type="submit" value="Iniciar sesión">
                </div>

                <div class="links_inicio_sesion">
                    <router-link to="/forgot-password">¿Olvidó su contraseña?</router-link><br>
                    <router-link to="/register">¿No tienes una cuenta? Regístrate aquí</router-link><br><br>
                </div>
            </form>
        </div>
    `,
    data() {
        return {
            form: { email: '', password: '' },
            error: ''
        };
    },
    methods: {
        async handleLogin() {
            this.error = '';
            const email = (this.form.email || '').trim().toLowerCase();
            const password = (this.form.password || '').trim();

            if (!email || !password) {
                this.error = 'Por favor, complete todos los campos.';
                return;
            }

            if (!Utils.isValidULEAMEmail(email)) {
                this.error = 'Ingrese su correo institucional ULEAM (ej: usuario@uleam.edu.ec o usuario@live.uleam.edu.ec).';
                return;
            }

            const users = JSON.parse(localStorage.getItem('users') || '[]');
            const user = users.find(u => (u.email || '').toLowerCase() === email);

            if (!user) {
                this.error = 'Usuario o contraseña incorrectos.';
                return;
            }

            const passHash = await Utils.hashSHA256(password);
            if (passHash !== user.passwordHash) {
                this.error = 'Usuario o contraseña incorrectos.';
                return;
            }

            localStorage.setItem('session', JSON.stringify({ 
                email: user.email, 
                name: user.name, 
                rol: user.rol 
            }));

            const role = (user.rol || '').toString().toLowerCase();
            if (role === 'administrativo' || role === 'administrador' || role === 'admin') {
                this.$router.push('/dashboard');
            } else {
                this.$router.push('/publications');
            }
        }
    },
    async mounted() {
        // Asegurar existencia de admin
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const adminEmail = 'admin@uleam.edu.ec';
        if (!users.find(u => (u.email || '').toLowerCase() === adminEmail)) {
            const adminPass = 'Admin1234!';
            const passHash = await Utils.hashSHA256(adminPass);
            users.push({ 
                email: adminEmail, 
                name: 'Administrador', 
                rol: 'administrativo', 
                passwordHash: passHash 
            });
            localStorage.setItem('users', JSON.stringify(users));
            console.info('Usuario administrador creado:', adminEmail, '/', adminPass);
        }
    }
};