import Foundation

// MARK: - Configuration

enum APIConfig {
    /// Change this to your backend URL (e.g. http://localhost:3000 for local dev)
    static let baseURL = "http://localhost:3000/api"
}

// MARK: - API Service

class APIService {
    static let shared = APIService()
    private let session: URLSession
    private var authToken: String?

    private init() {
        let config = URLSessionConfiguration.default
        config.httpCookieAcceptPolicy = .always
        config.httpShouldSetCookies = true
        session = URLSession(configuration: config)
    }

    func setToken(_ token: String?) {
        authToken = token
    }

    // MARK: - Generic Request

    private func request<T: Decodable>(
        path: String,
        method: String = "GET",
        body: Encodable? = nil
    ) async throws -> T {
        guard let url = URL(string: APIConfig.baseURL + path) else {
            throw URLError(.badURL)
        }
        var req = URLRequest(url: url)
        req.httpMethod = method
        req.setValue("application/json", forHTTPHeaderField: "Content-Type")
        if let token = authToken {
            req.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
        }
        if let body = body {
            req.httpBody = try JSONEncoder().encode(body)
        }
        let (data, response) = try await session.data(for: req)
        if let httpResponse = response as? HTTPURLResponse,
           !(200...299).contains(httpResponse.statusCode) {
            let apiError = try? JSONDecoder().decode(APIError.self, from: data)
            throw apiError ?? APIError(error: "HTTP \(httpResponse.statusCode)")
        }
        return try JSONDecoder().decode(T.self, from: data)
    }

    // MARK: - Auth

    func login(email: String, password: String) async throws -> AuthResponse {
        try await request(path: "/auth/login", method: "POST",
                          body: LoginRequest(email: email, password: password))
    }

    func register(email: String, password: String) async throws -> AuthResponse {
        try await request(path: "/auth/register", method: "POST",
                          body: RegisterRequest(email: email, password: password))
    }

    func logout() async throws {
        let _: EmptyResponse = try await request(path: "/auth/logout", method: "POST")
    }

    func getCurrentUser() async throws -> AppUser {
        try await request(path: "/auth/me")
    }

    // MARK: - Wizard Draft

    func saveDraft(_ draft: WizardDraft) async throws {
        let body = DraftPayload(
            wizardVersion: draft.wizardVersion,
            currentStep: draft.currentStep,
            personalInfo: draft.personalInfo,
            address: draft.address,
            trustedPerson: draft.trustedPerson,
            medicalPrefs: draft.medicalPrefs,
            scenarios: draft.scenarios,
            personalValues: draft.personalValues
        )
        let _: EmptyResponse = try await request(path: "/wizard/draft", method: "PUT", body: body)
    }

    func loadDraft() async throws -> WizardDraftResponse {
        try await request(path: "/wizard/draft")
    }

    // MARK: - Documents

    func generateDocuments(selectedTypes: [DocumentTypeKey], draft: WizardDraft) async throws -> DocumentPackage {
        let body = GenerateRequest(
            selectedDocumentTypes: selectedTypes.map { $0.rawValue },
            answersSnapshot: AnswersSnapshot(
                wizardVersion: draft.wizardVersion,
                personalInfo: draft.personalInfo,
                address: draft.address,
                trustedPerson: draft.trustedPerson,
                medicalPrefs: draft.medicalPrefs,
                scenarios: draft.scenarios,
                personalValues: draft.personalValues
            )
        )
        return try await request(path: "/documents/generate", method: "POST", body: body)
    }

    func listDocuments() async throws -> [DocumentPackage] {
        try await request(path: "/documents")
    }

    func downloadDocument(packageId: String, docId: String) async throws -> Data {
        guard let url = URL(string: APIConfig.baseURL + "/documents/\(packageId)/\(docId)/download") else {
            throw URLError(.badURL)
        }
        var req = URLRequest(url: url)
        if let token = authToken {
            req.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
        }
        let (data, _) = try await session.data(for: req)
        return data
    }
}

// MARK: - Helper types

private struct EmptyResponse: Codable {}

private struct DraftPayload: Codable {
    let wizardVersion: String
    let currentStep: Int
    let personalInfo: PersonalInfo?
    let address: AddressInfo?
    let trustedPerson: TrustedPerson?
    let medicalPrefs: MedicalPrefs?
    let scenarios: Scenarios?
    let personalValues: PersonalValues?
}

struct WizardDraftResponse: Codable {
    let draft: WizardDraft?
}

private struct GenerateRequest: Codable {
    let selectedDocumentTypes: [String]
    let answersSnapshot: AnswersSnapshot
}

private struct AnswersSnapshot: Codable {
    let wizardVersion: String
    let personalInfo: PersonalInfo?
    let address: AddressInfo?
    let trustedPerson: TrustedPerson?
    let medicalPrefs: MedicalPrefs?
    let scenarios: Scenarios?
    let personalValues: PersonalValues?
}
