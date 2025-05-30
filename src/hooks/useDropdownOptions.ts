import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabase";

type DropdownOptions = {
  operators: string[];
  departurePorts: string[];
  arrivalPorts: string[];
  statuses: string[];
};

export function useDropdownOptions(): DropdownOptions {
  const [operators, setOperators] = useState<string[]>([]);
  const [departurePorts, setDeparturePorts] = useState<string[]>([]);
  const [arrivalPorts, setArrivalPorts] = useState<string[]>([]);
  const [statuses, setStatuses] = useState<string[]>([]);

  useEffect(() => {
    const fetchOptions = async () => {
      // Fetch distinct operators
      const operatorRes = await supabase
        .from("ferry_schedules")
        .select("operator")
        .not("operator", "is", null);

      if (!operatorRes.error) {
        const uniqueOperators = [
          ...new Set(operatorRes.data?.map((d) => d.operator)),
        ] as string[];
        setOperators(uniqueOperators);
      }

      // Fetch distinct departure ports
      const depPortRes = await supabase
        .from("ferry_schedules")
        .select("departure_port")
        .not("departure_port", "is", null);

      if (!depPortRes.error) {
        const uniqueDepPorts = [
          ...new Set(depPortRes.data?.map((d) => d.departure_port)),
        ] as string[];
        setDeparturePorts(uniqueDepPorts);
      }

      // Fetch distinct arrival ports
      const arrPortRes = await supabase
        .from("ferry_schedules")
        .select("arrival_port")
        .not("arrival_port", "is", null);

      if (!arrPortRes.error) {
        const uniqueArrPorts = [
          ...new Set(arrPortRes.data?.map((d) => d.arrival_port)),
        ] as string[];
        setArrivalPorts(uniqueArrPorts);
      }

      // Fetch distinct statuses
      const statusRes = await supabase
        .from("ferry_schedules")
        .select("status")
        .not("status", "is", null);

      if (!statusRes.error) {
        const uniqueStatuses = [
          ...new Set(statusRes.data?.map((d) => d.status)),
        ] as string[];
        setStatuses(uniqueStatuses);
      }
    };

    fetchOptions();
  }, []);

  return {
    operators,
    departurePorts,
    arrivalPorts,
    statuses,
  };
}
