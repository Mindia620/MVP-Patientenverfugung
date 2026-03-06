import SwiftUI

struct Step0DocumentsView: View {
    @EnvironmentObject var wizard: WizardViewModel
    @State private var selected: Set<DocumentTypeKey> = []

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 24) {
                VStack(alignment: .leading, spacing: 8) {
                    Text("Welche Dokumente möchten Sie erstellen?")
                        .font(.title2)
                        .fontWeight(.bold)
                    Text("Sie können mehrere Dokumente auswählen. Der Assistent führt Sie durch alle relevanten Fragen.")
                        .foregroundColor(.secondary)
                }
                .padding(.horizontal)
                .padding(.top)

                VStack(spacing: 12) {
                    ForEach(DocumentTypeKey.allCases) { type in
                        SelectionCard(
                            title: type.displayName,
                            description: type.description,
                            isSelected: selected.contains(type),
                            action: {
                                if selected.contains(type) {
                                    selected.remove(type)
                                } else {
                                    selected.insert(type)
                                }
                            }
                        )
                    }
                }
                .padding(.horizontal)
            }
        }

        WizardNavButtons(
            onBack: nil,
            onNext: {
                wizard.setDocumentTypes(Array(selected))
                wizard.goNext()
            },
            nextDisabled: selected.isEmpty
        )
        .onAppear {
            if let existing = wizard.selectedTypes {
                selected = Set(existing)
            }
        }
    }
}
