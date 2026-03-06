import Foundation

// Mirrors frontend/src/lib/wizardSteps.ts

/// Which document types require each wizard step (route 0–13)
private let stepRequiresDocuments: [Int: [DocumentTypeKey]?] = [
    0: nil, // "all" – document selection always shown
    1: nil, // Personal info
    2: nil, // Address
    3: [.VORSORGEVOLLMACHT, .BETREUUNGSVERFUEGUNG], // Trusted person basis
    4: [.VORSORGEVOLLMACHT, .BETREUUNGSVERFUEGUNG], // Trusted person address
    5: [.PATIENTENVERFUEGUNG, .VORSORGEVOLLMACHT],  // Medical 1
    6: [.PATIENTENVERFUEGUNG, .VORSORGEVOLLMACHT],  // Medical 2
    7: [.PATIENTENVERFUEGUNG, .VORSORGEVOLLMACHT],  // Scenario: terminal
    8: [.PATIENTENVERFUEGUNG, .VORSORGEVOLLMACHT],  // Scenario: coma
    9: [.PATIENTENVERFUEGUNG, .VORSORGEVOLLMACHT],  // Scenario: dementia
    10: [.PATIENTENVERFUEGUNG, .BETREUUNGSVERFUEGUNG], // Values
    11: nil, // Summary
    12: nil, // Create account
    13: nil, // Documents
]

func isStepActive(_ route: Int, selectedTypes: [DocumentTypeKey]?) -> Bool {
    guard let selected = selectedTypes, !selected.isEmpty else { return true }
    guard let required = stepRequiresDocuments[route] else { return true } // nil = "all"
    return required?.contains(where: { selected.contains($0) }) ?? true
}

func getActiveSteps(selectedTypes: [DocumentTypeKey]?) -> [Int] {
    (0...13).filter { isStepActive($0, selectedTypes: selectedTypes) }
}

func getNextRoute(_ current: Int, selectedTypes: [DocumentTypeKey]?) -> Int {
    let active = getActiveSteps(selectedTypes: selectedTypes)
    guard let idx = active.firstIndex(of: current), idx < active.count - 1 else { return current }
    return active[idx + 1]
}

func getPrevRoute(_ current: Int, selectedTypes: [DocumentTypeKey]?) -> Int {
    let active = getActiveSteps(selectedTypes: selectedTypes)
    guard let idx = active.firstIndex(of: current), idx > 0 else { return current }
    return active[idx - 1]
}

func getDisplayStep(_ route: Int, selectedTypes: [DocumentTypeKey]?) -> Int {
    let active = getActiveSteps(selectedTypes: selectedTypes)
    return (active.firstIndex(of: route) ?? 0) + 1
}

func getTotalSteps(selectedTypes: [DocumentTypeKey]?) -> Int {
    getActiveSteps(selectedTypes: selectedTypes).count
}
