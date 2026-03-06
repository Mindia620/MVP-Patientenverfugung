import SwiftUI

struct ContentView: View {
    @EnvironmentObject var authViewModel: AuthViewModel
    @EnvironmentObject var wizardViewModel: WizardViewModel
    @State private var showWizard = false

    var body: some View {
        NavigationStack {
            if authViewModel.isAuthenticated {
                DashboardView()
            } else if showWizard {
                WizardContainerView(onExit: { showWizard = false })
            } else {
                HomeView(onStartWizard: { showWizard = true })
            }
        }
    }
}
