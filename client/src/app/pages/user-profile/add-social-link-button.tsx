import { supportedSocialLinks } from "@/app/components/badges/social-link-badge";
import { Button } from "@/app/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/app/components/ui/command";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/app/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/app/components/ui/popover";
import useAuthStore from "@/app/providers/auth-providers";
import useUserProfileStore from "@/app/providers/user-profile-provider";
import UserHandler from "@/handlers/user-handlers";
import { cn } from "@/lib/utils";
import UserValidator, {
  SocialLinkSchemaType,
} from "@/validators/user-validators";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog } from "@radix-ui/react-dialog";
import { Check, ChevronsUpDown } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { FiPlus } from "react-icons/fi";

const AddSocialLinkButton = () => {
  //popover
  const { setCurrentUser } = useAuthStore((state) => state);
  const { setUser } = useUserProfileStore();
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SocialLinkSchemaType>({
    resolver: zodResolver(UserValidator.socialLinkSchema),
  });
  const platforms: {
    value: string;
    label: string;
  }[] = [];

  for (const platform in supportedSocialLinks) {
    platforms.push({
      value: platform,
      label: platform.charAt(0).toUpperCase() + platform.slice(1),
    });
  }

  const onSubmit = (data: SocialLinkSchemaType) => {
    if (!value) return toast.error("Please select a platform.");
    UserHandler.editUserDetails({ socialLinks: [{ ...data, label: value }] })
      .then((res) => {
        toast.success("Social link added successfully.");
        setCurrentUser(res);
        setUser(res);
        setIsDialogOpen(false);
        setValue("");
        reset();
      })
      .catch((err) => {
        toast.error(err);
      });
  };
  return (
    <Dialog open={isDialogOpen}>
      <DialogTrigger onClick={() => setIsDialogOpen(true)}>
        <Button variant="outline" className="w-full">
          <FiPlus className="w-4 h-4" />
          <span className="ml-1">Add Social Links</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
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
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col w-full gap-3 mx-auto">
            <input
              className="w-full p-2 text-sm font-medium border border-gray-200 rounded-lg bg-muted placeholder-muted-foreground placeholder:opacity-40 focus:outline-none focus:border-gray-400 focus:bg-background"
              type="text"
              placeholder="your_username"
              id="name"
              {...register("name")}
            />
            {errors.name && (
              <p className="text-xs text-red-500 opacity-80">
                {errors.name.message}
              </p>
            )}
            <input
              className="w-full p-2 text-sm font-medium border border-gray-200 rounded-lg bg-muted placeholder-muted-foreground placeholder:opacity-40 focus:outline-none focus:border-gray-400 focus:bg-background"
              type="text"
              placeholder="https://facebook.com/your_username"
              id="url"
              {...register("url")}
            />
            {errors.url && (
              <p className="text-xs text-red-500 opacity-80">
                {errors.url.message}
              </p>
            )}
          </div>
          <DialogFooter className="mt-3">
            <Button
              variant="ghost"
              type="reset"
              role="button"
              className=""
              onClick={() => {
                setIsDialogOpen(false);
                setValue("");
                reset();
              }}
            >
              Cancel
            </Button>
            <Button type="submit" className="px-6">
              {!isSubmitting ? "Save" : "Saving..."}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
export default AddSocialLinkButton;
