"use client";

import { Button, Card, Chip, Table } from "@heroui/react";
import { DELIVERY_STATUS, statusChipColor } from "@/lib/librarian-data";

const nextStatus = {
  [DELIVERY_STATUS.PENDING]: DELIVERY_STATUS.DISPATCHED,
  [DELIVERY_STATUS.DISPATCHED]: DELIVERY_STATUS.DELIVERED,
};

function formatDate(iso) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function ManageDeliveriesTable({ deliveries, onAdvanceStatus }) {
  return (
    <Card className="p-2">
      <Table>
        <Table.ScrollContainer>
          <Table.Content aria-label="Manage deliveries">
            <Table.Header>
              <Table.Column isRowHeader>Client</Table.Column>
              <Table.Column>Book Title</Table.Column>
              <Table.Column>Date</Table.Column>
              <Table.Column>Status</Table.Column>
              <Table.Column>Actions</Table.Column>
            </Table.Header>
            <Table.Body
              items={deliveries}
              renderEmptyState={() => (
                <div className="px-4 py-10 text-center text-sm text-[var(--rr-ink-dim)]">
                  No delivery requests yet.
                </div>
              )}
            >
              {(delivery) => {
                const upcoming = nextStatus[delivery.status];
                return (
                  <Table.Row id={delivery.id}>
                    <Table.Cell>{delivery.clientName}</Table.Cell>
                    <Table.Cell>
                      <span className="font-display text-[14px]">{delivery.bookTitle}</span>
                    </Table.Cell>
                    <Table.Cell>{formatDate(delivery.date)}</Table.Cell>
                    <Table.Cell>
                      <Chip color={statusChipColor[delivery.status]} variant="soft" size="sm">
                        {delivery.status}
                      </Chip>
                    </Table.Cell>
                    <Table.Cell>
                      {upcoming ? (
                        <Button
                          size="sm"
                          variant="outline"
                          onPress={() => onAdvanceStatus(delivery.id, upcoming)}
                        >
                          Mark as {upcoming}
                        </Button>
                      ) : (
                        <span className="font-mono-label text-[10px] uppercase text-[var(--rr-ink-dim)]">
                          Complete
                        </span>
                      )}
                    </Table.Cell>
                  </Table.Row>
                );
              }}
            </Table.Body>
          </Table.Content>
        </Table.ScrollContainer>
      </Table>
    </Card>
  );
}
