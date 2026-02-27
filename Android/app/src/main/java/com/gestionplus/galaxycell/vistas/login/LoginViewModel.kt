package com.gestionplus.galaxycell.vistas.login

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.gestionplus.galaxycell.data.repository.AuthRepository
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch

class LoginViewModel(
    private val repository: AuthRepository
) : ViewModel() {

    private val _uiState = MutableStateFlow(LoginUiState())
    val uiState: StateFlow<LoginUiState> = _uiState.asStateFlow()

    fun onUsernameChange(value: String) {
        _uiState.value = _uiState.value.copy(username = value)
    }

    fun onPasswordChange(value: String) {
        _uiState.value = _uiState.value.copy(password = value)
    }

    fun login() {

        val currentState = _uiState.value

        if (currentState.username.isBlank() || currentState.password.isBlank()) {
            _uiState.value = currentState.copy(
                errorMessage = "Campos vacíos"
            )
            return
        }

        viewModelScope.launch {

            _uiState.value = currentState.copy(
                isLoading = true,
                errorMessage = null
            )

            val result = repository.login(
                currentState.username,
                currentState.password
            )

            _uiState.value = if (result.isSuccess) {
                currentState.copy(
                    isLoading = false,
                    loginSuccess = true
                )
            } else {
                currentState.copy(
                    isLoading = false,
                    errorMessage = result.exceptionOrNull()?.message
                        ?: "Error desconocido"
                )
            }
        }
    }

    fun onGoogleSignIn(idToken: String) {
        viewModelScope.launch {
            _uiState.value = _uiState.value.copy(isLoading = true, errorMessage = null)
            val result = repository.loginWithGoogle(idToken) // Debes crear este método en el Repositorio

            _uiState.value = if (result.isSuccess) {
                _uiState.value.copy(isLoading = false, loginSuccess = true)
            } else {
                _uiState.value.copy(
                    isLoading = false,
                    errorMessage = result.exceptionOrNull()?.message ?: "Error de autenticación"
                )
            }
        }
    }

}