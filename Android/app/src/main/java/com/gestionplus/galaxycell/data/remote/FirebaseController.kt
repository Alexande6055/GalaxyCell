package com.gestionplus.galaxycell.data.remote

import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.auth.FirebaseUser
import kotlinx.coroutines.tasks.await

class FirebaseController {

    private val auth: FirebaseAuth = FirebaseAuth.getInstance()

    suspend fun signIn(email: String, password: String): FirebaseUser {
        val result = auth.signInWithEmailAndPassword(email, password).await()
        return result.user ?: throw Exception("Usuario no encontrado")
    }

    suspend fun createAccount(email: String, password: String): FirebaseUser {
        val result = auth.createUserWithEmailAndPassword(email, password).await()
        return result.user ?: throw Exception("No se pudo crear el usuario")
    }

    fun logout() {
        auth.signOut()
    }
    suspend fun signInWithGoogle(idToken: String): FirebaseUser {
        val credential = com.google.firebase.auth.GoogleAuthProvider.getCredential(idToken, null)
        val result = auth.signInWithCredential(credential).await()
        return result.user ?: throw Exception("Error al obtener usuario de Firebase")
    }

    fun getCurrentUser(): FirebaseUser? = auth.currentUser
}