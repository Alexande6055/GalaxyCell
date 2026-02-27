package com.gestionplus.galaxycell.vistas.login
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import com.gestionplus.galaxycell.data.remote.FirebaseController
import androidx.compose.material3.Button
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.runtime.getValue
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.tooling.preview.Preview
import androidx.lifecycle.viewmodel.compose.viewModel
import com.gestionplus.galaxycell.data.repository.AuthRepository
import com.google.android.libraries.identity.googleid.GetGoogleIdOption
import kotlinx.coroutines.launch
import androidx.credentials.CredentialManager
import androidx.credentials.GetCredentialRequest
import androidx.credentials.CustomCredential
import androidx.credentials.exceptions.GetCredentialException
import com.google.android.libraries.identity.googleid.GoogleIdTokenCredential
import com.google.android.libraries.identity.googleid.GoogleIdTokenCredential.Companion.TYPE_GOOGLE_ID_TOKEN_CREDENTIAL
import com.gestionplus.galaxycell.R
/*

@Composable
fun LoginScreen(
    onLoginSuccess: () -> Unit
) {
    val firebaseController = FirebaseController()
    val repository = AuthRepository(firebaseController)
    val factory = LoginViewModelFactory(repository)
    val viewModel = viewModel<LoginViewModel>(factory = factory)
    val uiState by viewModel.uiState.collectAsState()

    LaunchedEffect(uiState.loginSuccess) {
        if (uiState.loginSuccess) {
            onLoginSuccess()
        }
    }

    Column {

        OutlinedTextField(
            value = uiState.username,
            onValueChange = { viewModel.onUsernameChange(it) },
            label = { Text("Usuario") }
        )

        OutlinedTextField(
            value = uiState.password,
            onValueChange = { viewModel.onPasswordChange(it) },
            label = { Text("Contraseña") }
        )

        uiState.errorMessage?.let {
            Text(it, color = MaterialTheme.colorScheme.error)
        }

        Button(
            onClick = { viewModel.login() },
            enabled = !uiState.isLoading
        ) {

            if (uiState.isLoading) {
                CircularProgressIndicator()
            } else {
                Text("Iniciar sesión")
            }
        }
    }
}
@Preview(showBackground = true)
@Composable
fun LoginPreview(){
    LoginScreen ( onLoginSuccess = {
        // Aquí navegarías a HomeScreen
        println("Login correcto")
    })
}*/

@Composable
fun LoginScreen(
    viewModel: LoginViewModel,
    onLoginSuccess: () -> Unit
) {
    val context = LocalContext.current
    val coroutineScope = rememberCoroutineScope ()
    val uiState by viewModel.uiState.collectAsState()

    // 1. Configurar Credential Manager
    val credentialManager = CredentialManager.create(context)

    fun launchGoogleSignIn() {
        coroutineScope.launch {
            try {
                // Configurar la solicitud de Google (según la doc)
                val googleIdOption = GetGoogleIdOption.Builder()
                    .setServerClientId(context.getString(R.string.default_web_client_id))
                    .setFilterByAuthorizedAccounts(false) // Pon false para que siempre deje elegir cuenta
                    .build()

                val request = GetCredentialRequest.Builder()
                    .addCredentialOption(googleIdOption)
                    .build()

                // Lanzar el selector de cuentas
                val result = credentialManager.getCredential(context, request)

                // Manejar el resultado
                val credential = result.credential
                if (credential is CustomCredential && credential.type == TYPE_GOOGLE_ID_TOKEN_CREDENTIAL) {
                    val googleIdTokenCredential = GoogleIdTokenCredential.createFrom(credential.data)
                    viewModel.onGoogleSignIn(googleIdTokenCredential.idToken)
                }
            } catch (e: Exception) {
                // Manejar error (ej. usuario canceló el diálogo)
                println("Error en Credential Manager: ${e.message}")
            }
        }
    }

    // Tu UI
    Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
        if (uiState.isLoading) {
            CircularProgressIndicator()
        } else {
            Button(onClick = { launchGoogleSignIn() }) {
                Text("Iniciar sesión con Google")
            }
        }
    }

    // Navegación al éxito
    LaunchedEffect(uiState.loginSuccess) {
        if (uiState.loginSuccess) onLoginSuccess()
    }
}