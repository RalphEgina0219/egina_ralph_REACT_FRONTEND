<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class HumanResourceController extends Controller
{
    public function payroll(Request $request)
    {
        $age = $request->age;
        
        return response()->json([
            'age' => $age,
        ]); 
    }   

     public function calculate(Request $request)
    {
        $employmentType = $request->employmentType;
        $positionTier = $request->positionTier;
        $daysAbsent = $request->daysAbsent;
        $minutesLate = $request->minutesLate;
        $overtimeHours = $request->overtimeHours;

        if ($employmentType == "COS") 
            {

            $baseSalary = 18000;
            $sss = 0;
            $philhealth = 0;
            $pagibig = 0;

        } elseif ($employmentType == "Regular" && $positionTier == "Junior") 
        
        {

            $baseSalary = 25000;
            $sss = 1125;
            $philhealth = 625;
            $pagibig = 200;

        } elseif ($employmentType == "Regular" && $positionTier == "Senior")
         {

            $baseSalary = 40000;
            $sss = 1800;
            $philhealth = 1000;
            $pagibig = 200;

        } else 
        {


            return response()->json([
                "message" => "Invalid Employment Type or Position Tier"
            ], 400);

        }

        $daysPresent = 22 - $daysAbsent;
        $dailyRate = $baseSalary / 22;
        $hourlyRate = $dailyRate / 8;

        $lateDeduction = ($hourlyRate / 60) * $minutesLate;
        $absentDeduction = $dailyRate * $daysAbsent;
        $overtimePay = $overtimeHours * ($hourlyRate * 1.25);

        $grossPay = $baseSalary - $lateDeduction - $absentDeduction + $overtimePay;

        $totalDeductions = $sss + $philhealth + $pagibig;

        $netPay = $grossPay - $totalDeductions;

        return response()->json([
            "employmentType" => $employmentType,
            "positionTier" => $positionTier,
            "baseSalary" => $baseSalary,
            "daysPresent" => $daysPresent,
            "dailyRate" => round($dailyRate, 2),
            //"hourlyRate" => round($hourlyRate, 2),
            "lateDeduction" => round($lateDeduction, 2),
            "absentDeduction" => round($absentDeduction, 2),
            "overtimePay" => round($overtimePay, 2),
            "grossPay" => round($grossPay, 2),
            "sss" => $sss,
            "philhealth" => $philhealth,
            "pagibig" => $pagibig,
            "totalDeductions" => $totalDeductions,
            "netPay" => round($netPay, 2)
        ]);
    }
}
