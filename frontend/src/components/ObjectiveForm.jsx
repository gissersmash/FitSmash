// frontend/src/components/ObjectiveForm.js
import { useForm } from "@mantine/form";
import { TextInput, NumberInput, Button, Group, Text } from "@mantine/core";
import { createObjective } from "../services/objectiveService";

export default function ObjectiveForm({ onAdded }) {
  const form = useForm({
    initialValues: {
      title: "",
      target_value: 0,
      unit: "",
      deadline: ""
    },
    validate: {
      title: (v) => (v.length < 3 ? "Titre trop court" : null),
      target_value: (v) => (v <= 0 ? "Doit être > 0" : null)
    }
  });

  const handleSubmit = async (values) => {
    try {
      await createObjective(values);
      form.reset();
      if (onAdded) onAdded();
    } catch (e) {
      alert(e.response?.data?.message || "Erreur création objectif");
    }
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <TextInput label="Titre" placeholder="Perdre du poids" {...form.getInputProps("title")} mb="sm" />
      <Group grow>
        <NumberInput label="Cible" {...form.getInputProps("target_value")} min={0} />
        <TextInput label="Unité" placeholder="kg / h / min" {...form.getInputProps("unit")} />
      </Group>
      <TextInput label="Deadline (YYYY-MM-DD)" placeholder="2025-12-31" {...form.getInputProps("deadline")} mb="sm" />
      <Button type="submit" mt="sm">Ajouter objectif</Button>
    </form>
  );
}
