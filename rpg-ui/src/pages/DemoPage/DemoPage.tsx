import { Button } from "@/components/Button/Button";
import { CircularMenu } from "@/components/CircularMenu/CircularMenu";
import { ExpandingMenu } from "@/components/ExpandingMenu/ExpandingMenu";
import { InfoBox } from "@/components/InfoBox/InfoBox";
import { RadioTabs } from "@/components/RadioTabs/RadioTabs";
import { SlideText } from "@/components/SlideText/SlideText";
import {
  Download,
  Edit,
  Menu,
  Plus,
  Search,
  Settings,
  Trash,
  User,
} from "lucide-react";
import { useState } from "react";

export function DemoPage() {
  const [radioTabValue, setRadioTabValue] = useState("1");

  const handleRadioTabChange = (e: any) => {
    setRadioTabValue(e);
  };

  return (
    <div className="flex flex-col justify-center items-center mt-10 gap-10 pt-20">
      {/* Slide Text */}
      <SlideText text="Cyberpunk Theme" theme="cyberpunk" />

      <div>
        <Button variant="glitch">Press Glitch</Button>
      </div>

      <div>
        <CircularMenu
          triggerIcon={Menu}
          theme="cyberpunk"
          items={[
            {
              icon: User,
              label: "Profile",
              onClick: () => console.log("Profile clicked"),
            },
            {
              icon: Plus,
              label: "Create",
              onClick: () => console.log("Create clicked"),
            },
            {
              icon: Search,
              label: "Search",
              onClick: () => console.log("Search clicked"),
            },
            {
              icon: Settings,
              label: "Settings",
              onClick: () => console.log("Settings clicked"),
            },
            {
              icon: Download,
              label: "Download",
              onClick: () => console.log("Download clicked"),
            },
            {
              icon: Edit,
              label: "Edit",
              onClick: () => console.log("Edit clicked"),
            },
            {
              icon: Trash,
              label: "Delete",
              onClick: () => console.log("Delete clicked"),
            },
            {
              icon: User,
              label: "User",
              onClick: () => console.log("User clicked"),
            },
          ]}
        />
      </div>

      <div className="flex flex-col justify-center">
        <ExpandingMenu
          triggerIcon={Menu}
          theme="cyberpunk"
          items={[
            {
              icon: User,
              label: "Profile",
              onClick: () => console.log("Profile clicked"),
            },
            {
              icon: Plus,
              label: "Create",
              onClick: () => console.log("Create clicked"),
            },
            {
              icon: Search,
              label: "Search",
              onClick: () => console.log("Search clicked"),
            },
            {
              icon: Settings,
              label: "Settings",
              onClick: () => console.log("Settings clicked"),
            },
          ]}
        />
        <ExpandingMenu
          triggerIcon={Menu}
          theme="cyberpunk"
          items={[
            {
              icon: User,
              label: "Profile",
              onClick: () => console.log("Profile clicked"),
            },
            {
              icon: Plus,
              label: "Create",
              onClick: () => console.log("Create clicked"),
            },
            {
              icon: Search,
              label: "Search",
              onClick: () => console.log("Search clicked"),
            },
            {
              icon: Settings,
              label: "Settings",
              onClick: () => console.log("Settings clicked"),
            },
          ]}
        />
      </div>
      <div className="w-[180px]">
        <RadioTabs
          options={[
            { value: "1", label: "One" },
            { value: "2", label: "Two" },
            { value: "3", label: "Three" },
            { value: "4", label: "Four" },
          ]}
          value={radioTabValue}
          defaultValue={radioTabValue}
          onChange={(e) => handleRadioTabChange(e)}
          name=""
          theme="cyberpunk"
          className=""
        />
      </div>
      <div className="w-[180px] pb-20">
        <InfoBox
          title="Box"
          message="This is an info box, cool eh!"
          theme="cyberpunk"
        />
      </div>
    </div>
  );
}
