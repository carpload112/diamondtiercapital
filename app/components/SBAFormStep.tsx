import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

interface Field {
  name: string
  label: string
  type: string
  placeholder?: string
  options?: string[]
}

interface SBAFormStepProps {
  step: {
    title: string
    fields: Field[]
  }
  formData: Record<string, string>
  onChange: (name: string, value: string) => void
}

export default function SBAFormStep({ step, formData, onChange }: SBAFormStepProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold mb-4">{step.title}</h2>
      {step.fields.map((field) => (
        <div key={field.name} className="space-y-2">
          <Label htmlFor={field.name}>{field.label}</Label>
          {field.type === "select" ? (
            <Select onValueChange={(value) => onChange(field.name, value)} value={formData[field.name] || ""}>
              <SelectTrigger>
                <SelectValue placeholder="Select an option" />
              </SelectTrigger>
              <SelectContent>
                {field.options?.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : field.type === "radio" ? (
            <RadioGroup onValueChange={(value) => onChange(field.name, value)} value={formData[field.name] || ""}>
              {field.options?.map((option) => (
                <div key={option} className="flex items-center space-x-2">
                  <RadioGroupItem value={option} id={`${field.name}-${option}`} />
                  <Label htmlFor={`${field.name}-${option}`}>{option}</Label>
                </div>
              ))}
            </RadioGroup>
          ) : (
            <Input
              id={field.name}
              name={field.name}
              type={field.type}
              placeholder={field.placeholder}
              value={formData[field.name] || ""}
              onChange={(e) => onChange(field.name, e.target.value)}
              className="w-full"
            />
          )}
        </div>
      ))}
    </div>
  )
}
