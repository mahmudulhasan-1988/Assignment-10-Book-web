import { Card, Chip, Table } from "@heroui/react";
import { deliveries, statusToChipColor } from "@/lib/dashboard-data";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function DeliveryHistoryTable() {
  return (
    <Card className="p-2">
      <Table>
        <Table.ScrollContainer>
          <Table.Content aria-label="Delivery history">
            <Table.Header>
              <Table.Column isRowHeader>Book Title</Table.Column>
              <Table.Column>Delivery Fee</Table.Column>
              <Table.Column>Request Date</Table.Column>
              <Table.Column>Status</Table.Column>
            </Table.Header>
            <Table.Body items={deliveries}>
              {(delivery) => (
                <Table.Row id={delivery.id}>
                  <Table.Cell>
                    <span className="font-display text-[15px]">{delivery.title}</span>
                  </Table.Cell>
                  <Table.Cell>
                    <span className="font-mono-label text-[var(--rr-gold-bright)]">
                      ${delivery.fee.toFixed(2)}
                    </span>
                  </Table.Cell>
                  <Table.Cell>{formatDate(delivery.requestDate)}</Table.Cell>
                  <Table.Cell>
                    <Chip color={statusToChipColor[delivery.status]} variant="soft" size="sm">
                      {delivery.status}
                    </Chip>
                  </Table.Cell>
                </Table.Row>
              )}
            </Table.Body>
          </Table.Content>
        </Table.ScrollContainer>
      </Table>
    </Card>
  );
}
