package com.gestionplus.galaxycell

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.Scaffold
import androidx.compose.ui.Modifier
import androidx.lifecycle.ViewModelProvider
import com.gestionplus.galaxycell.data.remote.FirebaseController
import com.gestionplus.galaxycell.data.repository.AuthRepository
import com.gestionplus.galaxycell.ui.theme.GalaxyCellTheme
import com.gestionplus.galaxycell.vistas.login.LoginScreen
import com.gestionplus.galaxycell.vistas.login.LoginViewModel
import com.gestionplus.galaxycell.vistas.login.LoginViewModelFactory

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        // 1. Instanciar manualmente las dependencias (ya que no usas Hilt/Dagger aún)
        val firebaseController = FirebaseController()
        val authRepository = AuthRepository(firebaseController)

        // 2. Crear el ViewModel usando la Factory que definimos
        val loginViewModel: LoginViewModel = ViewModelProvider(
            this,
            LoginViewModelFactory(authRepository)
        )[LoginViewModel::class.java]

        enableEdgeToEdge()
        setContent {
            GalaxyCellTheme {
                Scaffold(modifier = Modifier.fillMaxSize()) { innerPadding ->
                    // 3. Pasar el viewModel aquí
                    LoginScreen(
                        viewModel = loginViewModel,
                        onLoginSuccess = {
                            println("Login correcto")
                            // Aquí iría el código para cambiar de pantalla
                        }
                    )
                }
            }
        }
    }
}
