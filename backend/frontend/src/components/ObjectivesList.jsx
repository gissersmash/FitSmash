// frontend/src/components/ObjectivesList.js
import { Card, Text, Progress, Group, ActionIcon, Stack } from "@mantine/core";
import { IconTrash, IconEdit } from "@tabler/icons-react";
import { deleteObjective, updateObjective } from "../services/objectiveService";

export default function ObjectivesList({ items, onRefresh }) {
  const handleDelete = async (id) => {
    if (!confirm("Supprimer cet objectif ?")) return;
    try {
      await deleteObjective(id);
      if (onRefresh) onRefresh();
    } catch (e) {
      alert("Impossible de supprimer");
    }
  };

  const handleQuickInc = async (item) => {
    // exemple : incrémenter current_value de 1 (tu peux ajuster)
    try {
      const newVal = parseFloat(item.current_value) + 1;
      await updateObjective(item.id, { current_value: newVal });
      if (onRefresh) onRefresh();
    } catch (e) {
      alert("Erreur mise à jour");
    }
  };

  return (
    <Stack spacing="sm">
      {items.map((it) => {
        const progress = it.target_value > 0 ? Math.min(100, (it.current_value / it.target_value) * 100) : 0;
        return (
          <Card key={it.id} shadow="sm" padding="sm" withBorder>
            <Group position="apart">
              <div>
                <Text weight={700}>{it.title}</Text>
                <Text size="sm" color="dimmed">
                  {it.current_value}/{it.target_value} {it.unit} • {it.deadline ?? "Sans date"}
                </Text>
              </div>

              <Group>
                <ActionIcon onClick={() => handleQuickInc(it)} title="+1 (ex)"><IconEdit size={16} /></ActionIcon>
                <ActionIcon color="red" onClick={() => handleDelete(it.id)} title="Supprimer"><IconTrash size={16} /></ActionIcon>
              </Group>
            </Group>

            <Progress value={progress} mt="sm" />
            <Text size="xs" color="dimmed" mt="xs">{Math.round(progress)}% accompli</Text>
          </Card>
        );
      })}
    </Stack>
  );
}
