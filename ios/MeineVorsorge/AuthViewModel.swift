import Foundation
import SwiftUI

@MainActor
class AuthViewModel: ObservableObject {
    @Published var isAuthenticated = false
    @Published var currentUser: AppUser?
    @Published var isLoading = false
    @Published var errorMessage: String?

    private let tokenKey = "auth_token"

    init() {
        // Restore token if saved
        if let token = UserDefaults.standard.string(forKey: tokenKey) {
            APIService.shared.setToken(token)
            Task { await checkCurrentUser() }
        }
    }

    func login(email: String, password: String) async {
        isLoading = true
        errorMessage = nil
        do {
            let response = try await APIService.shared.login(email: email, password: password)
            handleAuthSuccess(response)
        } catch let error as APIError {
            errorMessage = error.error
        } catch {
            errorMessage = error.localizedDescription
        }
        isLoading = false
    }

    func register(email: String, password: String) async {
        isLoading = true
        errorMessage = nil
        do {
            let response = try await APIService.shared.register(email: email, password: password)
            handleAuthSuccess(response)
        } catch let error as APIError {
            errorMessage = error.error
        } catch {
            errorMessage = error.localizedDescription
        }
        isLoading = false
    }

    func logout() async {
        isLoading = true
        try? await APIService.shared.logout()
        clearAuth()
        isLoading = false
    }

    private func handleAuthSuccess(_ response: AuthResponse) {
        currentUser = response.user
        isAuthenticated = true
        if let token = response.token {
            APIService.shared.setToken(token)
            UserDefaults.standard.set(token, forKey: tokenKey)
        }
    }

    private func checkCurrentUser() async {
        do {
            currentUser = try await APIService.shared.getCurrentUser()
            isAuthenticated = true
        } catch {
            clearAuth()
        }
    }

    private func clearAuth() {
        isAuthenticated = false
        currentUser = nil
        APIService.shared.setToken(nil)
        UserDefaults.standard.removeObject(forKey: tokenKey)
    }
}
