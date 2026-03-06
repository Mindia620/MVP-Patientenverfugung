import SwiftUI

@main
struct MeineVorsorgeApp: App {
    @StateObject private var authViewModel = AuthViewModel()
    @StateObject private var wizardViewModel = WizardViewModel()

    var body: some Scene {
        WindowGroup {
            ContentView()
                .environmentObject(authViewModel)
                .environmentObject(wizardViewModel)
        }
    }
}
