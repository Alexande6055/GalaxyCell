package com.gestionplus.galaxycell.data.repository

import com.gestionplus.galaxycell.data.remote.FirebaseController
import com.google.firebase.auth.FirebaseUser

class AuthRepository(
    private val firebaseController: FirebaseController
) {

    suspend fun login(email: String, password: String): Result<FirebaseUser> {
        return try {
            val user = firebaseController.signIn(email, password)
            Result.success(user)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun loginWithGoogle(idToken: String): Result<FirebaseUser> {
        return try {
            val user = firebaseController.signInWithGoogle(idToken)
            Result.success(user)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
}