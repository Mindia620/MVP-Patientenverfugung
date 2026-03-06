import SwiftUI

struct WizardContainerView: View {
    let onExit: () -> Void
    @EnvironmentObject var wizard: WizardViewModel

    var body: some View {
        VStack(spacing: 0) {
            // Header
            HStack {
                Button(action: onExit) {
                    Image(systemName: "xmark")
                        .font(.body)
                        .foregroundColor(.secondary)
                }
                Spacer()
                Text("Vorsorge erstellen")
                    .font(.headline)
                Spacer()
                // Balance the X button
                Image(systemName: "xmark")
                    .font(.body)
                    .hidden()
            }
            .padding()

            // Progress
            StepIndicatorView(current: wizard.displayStep, total: wizard.totalSteps)
                .padding(.bottom, 8)

            // Step content
            Group {
                switch wizard.currentStep {
                case 0:  Step0DocumentsView()
                case 1:  Step1PersonalView()
                case 2:  Step2AddressView()
                case 3:  Step3TrustedPersonView()
                case 4:  Step4TrustedPersonAddressView()
                case 5:  Step5Medical1View()
                case 6:  Step6Medical2View()
                case 7:  Step7ScenarioTerminalView()
                case 8:  Step8ScenarioComaView()
                case 9:  Step9ScenarioDementiaView()
                case 10: Step10ValuesView()
                case 11: Step11SummaryView()
                case 12: Step12AccountView()
                case 13: Step13DocumentsView()
                default: Step0DocumentsView()
                }
            }
            .animation(.easeInOut(duration: 0.2), value: wizard.currentStep)
        }
        .navigationBarHidden(true)
    }
}
