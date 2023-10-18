import React, { useEffect, useState } from "react";
import { useCMEditViewDataManager } from '@strapi/helper-plugin';
import { Button } from "@strapi/design-system/Button";

const MyCompo = () => {
    const { isCreatingEntry, initialData, modifiedData, onChange } = useCMEditViewDataManager();
    console.log(isCreatingEntry)
    //initialData.content = "asdfasdf";
    onChange({
        target: { name: "content", value: "new value" },
    });

  return (
    <Button
        variant="default"
    >
        Next 5 days
    </Button>
  );
}
export default MyCompo;