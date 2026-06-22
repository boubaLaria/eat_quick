"use client";

import { useState } from "react";
import MenuItemOrderModal from "@/components/MenuItemOrderModal";

type InitialCustomer = { id: string; name: string; email: string; phoneNumber?: string | null } | null;

type Props = {
  item: { name: string; price: number };
  initialCustomer: InitialCustomer;
};

export default function OrderButton({ item, initialCustomer }: Props) {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <button onClick={() => setModalOpen(true)} className="btn-primary">
        Commander — €{item.price.toFixed(2)}
      </button>
      <MenuItemOrderModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        item={item}
        initialCustomer={initialCustomer}
      />
    </>
  );
}
