import SwiftUI

struct Step7ScenarioTerminalView: View {
    @EnvironmentObject var wizard: WizardViewModel
    @State private var scenarios = Scenarios()

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 24) {
                scenarioHeader(
                    icon: "heart.slash.fill",
                    color: .red,
                    title: "Szenario: Unheilbare Krankheit",
                    description: "Sie leiden an einer unheilbaren Krankheit im fortgeschrittenen Stadium. Eine Heilung ist nicht mehr möglich."
                )

                VStack(spacing: 16) {
                    Text("Welche Priorität soll gelten?")
                        .font(.headline)
                        .padding(.horizontal)

                    SelectionCard(
                        title: "Lebensqualität im Vordergrund",
                        description: "Fokus auf Wohlbefinden und Schmerzlinderung. Lebensverlängernde Maßnahmen nur wenn sinnvoll.",
                        isSelected: scenarios.terminalComfort,
                        action: { scenarios.terminalComfort.toggle(); scenarios.terminalProlongLife = false }
                    )
                    SelectionCard(
                        title: "Lebensverlängerung im Vordergrund",
                        description: "Alle verfügbaren Maßnahmen zur Verlängerung des Lebens einsetzen.",
                        isSelected: scenarios.terminalProlongLife,
                        action: { scenarios.terminalProlongLife.toggle(); scenarios.terminalComfort = false }
                    )
                    SelectionCard(
                        title: "Hospizversorgung",
                        description: "Begleitung durch ein Hospiz oder ambulante Palliativversorgung.",
                        isSelected: scenarios.terminalHospice,
                        action: { scenarios.terminalHospice.toggle() }
                    )
                }
                .padding(.horizontal)
            }
        }

        WizardNavButtons(
            onBack: { wizard.goBack() },
            onNext: {
                wizard.setScenarios(scenarios)
                wizard.goNext()
            }
        )
        .onAppear {
            if let existing = wizard.draft.scenarios { scenarios = existing }
        }
    }
}

private func scenarioHeader(icon: String, color: Color, title: String, description: String) -> some View {
    VStack(alignment: .leading, spacing: 12) {
        HStack(spacing: 12) {
            Image(systemName: icon)
                .font(.title)
                .foregroundColor(color)
            Text(title)
                .font(.title2)
                .fontWeight(.bold)
        }
        Text(description)
            .foregroundColor(.secondary)
    }
    .padding(.horizontal)
    .padding(.top)
}
