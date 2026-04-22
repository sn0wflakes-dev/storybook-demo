import {Button} from "@/app/ui/component/Button";

export default function Home() {
  return (
      <div className="w-auto h-auto flex-1 flex justify-center items-center">
        <div className="container mx-auto p-4 w-96">
          <h1 className="text-2xl text-center mb-8" > This is example of button component </h1>
          <div className="flex flex-col gap-4">
            <Button variant="primary" size="sm"> Primary small </Button>
            <Button variant="primary" size="md"> Primary medium </Button>
            <Button variant="primary" size="lg"> Primary large </Button>
          </div>
        </div>
      </div>
  );
}
