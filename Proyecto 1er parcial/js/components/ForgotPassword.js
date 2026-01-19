const ForgotPassword = {
    template: `
        <div class="recuperar-wrapper">
            <div class="recuperar-left">
                <h1>¿Olvidó su contraseña?</h1>
                <p>Ingrese su correo institucional para recibir instrucciones de restablecimiento.</p>
            </div>

            <form @submit.prevent="handleSubmit" class="recuperar-card">
                <label for="email">Correo institucional:</label><br>
                <input v-model="email" type="email" id="email" required placeholder="usuario@institucion.edu"><br>

                <div v-if="error" class="error-message">{{ error }}</div>
                <div v-if="success" class="success-message">{{ success }}</div>

                <input type="submit" value="Enviar enlace de restablecimiento">
                <span class="small">Si no recibe el correo, revise su carpeta de spam.</span>

                <router-link to="/login">Volver a iniciar sesión</router-link>
            </form>
        </div>
    `,
    data() {
        return {
            email: '',
            error: '',
            success: ''
        };
    },
    methods: {
        handleSubmit() {
            this.error = '';
            this.success = '';
            const emailVal = (this.email || '').trim();

            if (!emailVal) {
                this.error = 'Por favor, ingrese su correo institucional.';
                return;
            }

            const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal);
            if (!emailValido) {
                this.error = 'Por favor, ingrese un correo electrónico válido.';
                return;
            }

            this.success = 'Si el correo existe en nuestro sistema, recibirá un enlace para restablecer la contraseña en breve.';
            setTimeout(() => {
                this.$router.push('/login');
            }, 3000);
        }
    }
};