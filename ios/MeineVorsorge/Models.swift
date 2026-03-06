import Foundation

// MARK: - Document Types

enum DocumentTypeKey: String, Codable, CaseIterable, Identifiable {
    case PATIENTENVERFUEGUNG
    case VORSORGEVOLLMACHT
    case BETREUUNGSVERFUEGUNG

    var id: String { rawValue }

    var displayName: String {
        switch self {
        case .PATIENTENVERFUEGUNG: return "Patientenverfügung"
        case .VORSORGEVOLLMACHT: return "Vorsorgevollmacht"
        case .BETREUUNGSVERFUEGUNG: return "Betreuungsverfügung"
        }
    }

    var description: String {
        switch self {
        case .PATIENTENVERFUEGUNG:
            return "Regelt Ihre medizinische Behandlung, wenn Sie nicht mehr entscheidungsfähig sind."
        case .VORSORGEVOLLMACHT:
            return "Bevollmächtigt eine Vertrauensperson, in Ihrem Namen zu handeln."
        case .BETREUUNGSVERFUEGUNG:
            return "Legt fest, wer Sie als Betreuer unterstützen soll."
        }
    }
}

// MARK: - Personal Info

struct PersonalInfo: Codable, Equatable {
    var firstName: String = ""
    var lastName: String = ""
    var birthDate: String = ""
    var birthPlace: String = ""
}

// MARK: - Address

struct AddressInfo: Codable, Equatable {
    var street: String = ""
    var houseNumber: String = ""
    var postalCode: String = ""
    var city: String = ""
}

// MARK: - Trusted Person

struct TrustedPerson: Codable, Equatable {
    var firstName: String = ""
    var lastName: String = ""
    var relationship: String = ""
    var phone: String = ""
    var email: String = ""
    var street: String = ""
    var houseNumber: String = ""
    var postalCode: String = ""
    var city: String = ""
}

// MARK: - Medical Preferences

struct MedicalPrefs: Codable, Equatable {
    var painManagement: String = "yes"
    var palliativeCare: String = "yes"
    var artificialNutrition: String = "no"
    var artificialVentilation: String = "no"
    var resuscitation: String = "no"
    var dialysis: String = "no"
    var antibiotics: String = "yes"
    var bloodTransfusion: String = "yes"
    var organDonation: String = "undecided"
}

// MARK: - Scenarios

struct Scenarios: Codable, Equatable {
    // Terminal illness
    var terminalComfort: Bool = true
    var terminalProlongLife: Bool = false
    var terminalHospice: Bool = false
    // Coma
    var comaRehabChance: String = "withhold"
    var comaNoRehabChance: String = "withhold"
    // Dementia
    var dementiaMild: String = "continue"
    var dementiaSevere: String = "comfort"
    var dementiaAggressive: String = "withhold"
}

// MARK: - Personal Values

struct PersonalValues: Codable, Equatable {
    var qualityOverLength: Bool = true
    var independenceImportant: Bool = true
    var socialContact: Bool = true
    var religiousBelief: String = ""
    var additionalWishes: String = ""
    var homeOrHospital: String = "home"
}

// MARK: - Wizard Draft (local)

struct WizardDraft: Codable {
    var wizardVersion: String = "1.0"
    var selectedDocumentTypes: [DocumentTypeKey]? = nil
    var personalInfo: PersonalInfo? = nil
    var address: AddressInfo? = nil
    var trustedPerson: TrustedPerson? = nil
    var medicalPrefs: MedicalPrefs? = nil
    var scenarios: Scenarios? = nil
    var personalValues: PersonalValues? = nil
    var currentStep: Int = 0
    var disclaimerAccepted: Bool = false
}

// MARK: - Auth / API Models

struct LoginRequest: Codable {
    let email: String
    let password: String
}

struct RegisterRequest: Codable {
    let email: String
    let password: String
}

struct AuthResponse: Codable {
    let user: AppUser
    let token: String?
}

struct AppUser: Codable, Equatable {
    let id: String
    let email: String
    let createdAt: String
}

// MARK: - Document Package

enum PackageStatus: String, Codable {
    case PROCESSING, COMPLETED, FAILED
}

struct DocumentPackage: Codable, Identifiable {
    let id: String
    let wizardVersion: String
    let label: String?
    let status: PackageStatus
    let createdAt: String
    let documents: [GeneratedDocument]
}

struct GeneratedDocument: Codable, Identifiable {
    let id: String
    let type: DocumentTypeKey
    let status: String
    let fileSize: Int?
    let generatedAt: String?
}

// MARK: - API Error

struct APIError: Codable, LocalizedError {
    let error: String
    var errorDescription: String? { error }
}
