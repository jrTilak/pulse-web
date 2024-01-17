import { useState } from "react";
import { Button } from "../../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../ui/dialog";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "../../ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "../../ui/popover";
import { FiPlus } from "react-icons/fi";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "../../../lib/utils";
import { useToast } from "../../../hooks/use-toast";
import { useAuthContext } from "@/hooks/use-auth";
import { UserType } from "@/types/user.types";
import { supportedSocialLinks } from "@/components/shared/badges/social-link-badge";
import UserValidator from "@/validators/user-validators";
import UserHandler from "@/handlers/user-handlers";
export function AddSocialLinkBtn() {
  const { setCurrentUser } = useAuthContext();
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  //popover
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const platforms = [];
  for (const platform in supportedSocialLinks) {
    platforms.push({
      value: platform,
      label: platform.charAt(0).toUpperCase() + platform.slice(1),
    });
  }

  const [formData, setFormData] = useState({} as UserType["socialLinks"][0]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    const isValid = UserValidator.validateSocialLink(formData);
    if (!isValid.success) {
      toast({
        title: "Invalid",
        description: isValid.error.errors[0].message,
        variant: "destructive",
      });
      return;
    }
    setIsSaving(true);
    const res = await UserHandler.editUserDetails({
      socialLinks: [isValid.data as UserType["socialLinks"][0]],
    });
    setIsSaving(false);
    if (!res.success) {
      toast({
        title: "Failed",
        description: res.message,
        variant: "destructive",
      });
      return;
    }
    setCurrentUser(res.data);
    setFormData({} as UserType["socialLinks"][0]);
    setValue("");
    setIsDialogOpen(false);
  };

  return (
    <Dialog open={isDialogOpen}>
      <DialogTrigger onClick={() => setIsDialogOpen(true)}>
        <Button variant="outline" className="w-full">
          <FiPlus className="w-4 h-4" />
          <span className="ml-1">Add Social Links</span>
        </Button>
      </DialogTrigger>
      <DialogContent
        className="sm:max-w-[425px]"
        // onBlur={() => setIsDialogOpen(false)}
      >
        <DialogHeader>
          <DialogTitle>Connect other profiles</DialogTitle>
          <DialogDescription>
            Add your social media links to your profile. Make sure to save after
            adding a link.
          </DialogDescription>
        </DialogHeader>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="justify-between w-full"
            >
              {value
                ? platforms.find((platform) => platform.value === value)?.label
                : "Select a platform..."}
              <ChevronsUpDown className="w-4 h-4 ml-2 opacity-50 shrink-0" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-0">
            <Command
              filter={(value, search) => {
                if (value === "others") return 1;
                if (value.includes(search)) return 1;
                return 0;
              }}
            >
              <CommandInput placeholder="Search platform..." />
              <CommandEmpty>No platform found.</CommandEmpty>
              <CommandGroup>
                {platforms.map((platform) => (
                  <CommandItem
                    key={platform.value}
                    value={platform.value}
                    onSelect={(currentValue) => {
                      setFormData(
                        (prev) =>
                          ({
                            ...prev,
                            label: currentValue,
                          } as UserType["socialLinks"][0])
                      );
                      setValue(currentValue === value ? "" : currentValue);
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === platform.value ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {platform.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover>

        <div className="flex flex-col w-full gap-4 mx-auto">
          <input
            className="w-full p-2 text-sm font-medium border border-gray-200 rounded-lg bg-muted placeholder-muted-foreground placeholder:opacity-40 focus:outline-none focus:border-gray-400 focus:bg-background"
            type="text"
            placeholder="your_username"
            id="name"
            name="name"
            onChange={(e) => handleChange(e)}
            value={formData.name}
          />
          <input
            className="w-full p-2 text-sm font-medium border border-gray-200 rounded-lg bg-muted placeholder-muted-foreground placeholder:opacity-40 focus:outline-none focus:border-gray-400 focus:bg-background"
            type="text"
            placeholder="https://facebook.com/your_username"
            id="url"
            name="url"
            onChange={(e) => handleChange(e)}
            value={formData.url}
          />
        </div>
        <DialogFooter>
          <Button
            variant="ghost"
            className=""
            onClick={() => {
              setIsDialogOpen(false);
              setFormData({} as UserType["socialLinks"][0]);
              setValue("");
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={(e) => handleSubmit(e)}
            type="submit"
            className="px-6"
          >
            {isSaving ? "Saving..." : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
