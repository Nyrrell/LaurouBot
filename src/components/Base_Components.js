import { ButtonStyle, ComponentType, TextInputStyle } from "slash-create";

export class Base_Components {
  textInput = ({ customId, label }) => ({
    type: ComponentType.ACTION_ROW,
    components: [
      {
        type: ComponentType.TEXT_INPUT,
        label: label,
        style: TextInputStyle.SHORT,
        custom_id: customId,
      },
    ],
  });

  paragraphInput = ({ customId, label, value }) => ({
    type: ComponentType.ACTION_ROW,
    components: [
      {
        type: ComponentType.TEXT_INPUT,
        label: label,
        style: TextInputStyle.PARAGRAPH,
        custom_id: customId,
        value: value,
      },
    ],
  });

  selectRole = (customId = "role") => ({
    type: ComponentType.ACTION_ROW,
    components: [
      {
        type: ComponentType.ROLE_SELECT,
        placeholder: "Choisis un rôle",
        custom_id: customId,
      },
    ],
  });

  selectChannel = (customId = "channel") => ({
    type: ComponentType.ACTION_ROW,
    components: [
      {
        type: ComponentType.CHANNEL_SELECT,
        custom_id: customId,
      },
    ],
  });

  continueButton = ({ customId, label = "Continuer" }) => ({
    type: ComponentType.ACTION_ROW,
    components: [
      {
        type: ComponentType.BUTTON,
        style: ButtonStyle.SUCCESS,
        custom_id: customId ? `${customId}:continue` : "continue",
        label: label,
      },
      {
        type: ComponentType.BUTTON,
        style: ButtonStyle.DESTRUCTIVE,
        custom_id: customId ? `${customId}:stop` : "stop",
        label: "Annuler",
      },
    ],
  });

  SuccessCmdEmbed = (message) => ({
    title: "✅  Opération réussie !",
    description: message,
    color: this.color.green,
  });

  AbortCmdEmbed = (message) => ({
    title: "❌  Annulation de l'opération !",
    description: message,
    color: this.color.red,
  });

  ErrorCmdEmbed = (message) => ({
    title: "⚠️  Une erreur s'est produite",
    description: message,
    color: this.color.yellow,
  });

  color = {
    green: parseInt("27ae60", 16),
    red: parseInt("c0392b", 16),
    blue: parseInt("2980b9", 16),
    violet: parseInt("8e44ad", 16),
    orange: parseInt("d35400", 16),
    yellow: parseInt("f39c12", 16),
  };
}
