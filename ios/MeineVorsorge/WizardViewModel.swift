import Foundation
import SwiftUI

@MainActor
class WizardViewModel: ObservableObject {
    @Published var draft: WizardDraft = WizardDraft()
    @Published var currentStep: Int = 0
    @Published var isLoading = false
    @Published var errorMessage: String?
    @Published var generatedPackage: DocumentPackage?

    private let draftKey = "wizard_draft"

    init() {
        loadLocalDraft()
    }

    // MARK: - Step navigation

    var selectedTypes: [DocumentTypeKey]? { draft.selectedDocumentTypes }

    var activeSteps: [Int] { getActiveSteps(selectedTypes: selectedTypes) }

    var displayStep: Int { getDisplayStep(currentStep, selectedTypes: selectedTypes) }
    var totalSteps: Int { getTotalSteps(selectedTypes: selectedTypes) }

    var canGoBack: Bool { getPrevRoute(currentStep, selectedTypes: selectedTypes) != currentStep }
    var isLastStep: Bool { getNextRoute(currentStep, selectedTypes: selectedTypes) == currentStep }

    func goNext() {
        currentStep = getNextRoute(currentStep, selectedTypes: selectedTypes)
    }

    func goBack() {
        currentStep = getPrevRoute(currentStep, selectedTypes: selectedTypes)
    }

    func goToStep(_ step: Int) {
        currentStep = step
    }

    // MARK: - Data setters

    func setDocumentTypes(_ types: [DocumentTypeKey]) {
        draft.selectedDocumentTypes = types
        saveLocalDraft()
    }

    func setPersonalInfo(_ info: PersonalInfo) {
        draft.personalInfo = info
        saveLocalDraft()
    }

    func setAddress(_ address: AddressInfo) {
        draft.address = address
        saveLocalDraft()
    }

    func setTrustedPerson(_ person: TrustedPerson) {
        draft.trustedPerson = person
        saveLocalDraft()
    }

    func setMedicalPrefs(_ prefs: MedicalPrefs) {
        draft.medicalPrefs = prefs
        saveLocalDraft()
    }

    func setScenarios(_ scenarios: Scenarios) {
        draft.scenarios = scenarios
        saveLocalDraft()
    }

    func setPersonalValues(_ values: PersonalValues) {
        draft.personalValues = values
        saveLocalDraft()
    }

    func acceptDisclaimer() {
        draft.disclaimerAccepted = true
        saveLocalDraft()
    }

    // MARK: - Reset

    func reset() {
        draft = WizardDraft()
        currentStep = 0
        generatedPackage = nil
        errorMessage = nil
        UserDefaults.standard.removeObject(forKey: draftKey)
    }

    // MARK: - Local persistence

    private func saveLocalDraft() {
        draft.currentStep = currentStep
        if let data = try? JSONEncoder().encode(draft) {
            UserDefaults.standard.set(data, forKey: draftKey)
        }
    }

    private func loadLocalDraft() {
        guard let data = UserDefaults.standard.data(forKey: draftKey),
              let saved = try? JSONDecoder().decode(WizardDraft.self, from: data) else { return }
        draft = saved
        currentStep = saved.currentStep
    }

    // MARK: - API sync

    func syncDraftToServer() async {
        guard !draft.personalInfo.flatMap({ $0.firstName }).isNilOrEmpty else { return }
        try? await APIService.shared.saveDraft(draft)
    }

    func loadDraftFromServer() async {
        isLoading = true
        do {
            let response = try await APIService.shared.loadDraft()
            if let serverDraft = response.draft {
                draft = serverDraft
                currentStep = serverDraft.currentStep
                saveLocalDraft()
            }
        } catch {
            errorMessage = error.localizedDescription
        }
        isLoading = false
    }

    // MARK: - Document generation

    func generateDocuments() async {
        guard let types = draft.selectedDocumentTypes, !types.isEmpty else { return }
        isLoading = true
        errorMessage = nil
        do {
            generatedPackage = try await APIService.shared.generateDocuments(selectedTypes: types, draft: draft)
        } catch let error as APIError {
            errorMessage = error.error
        } catch {
            errorMessage = error.localizedDescription
        }
        isLoading = false
    }
}

private extension Optional where Wrapped == String {
    var isNilOrEmpty: Bool { self?.isEmpty ?? true }
}
