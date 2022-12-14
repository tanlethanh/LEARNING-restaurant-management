import { Request, Response } from "express";

class HomepageController {
    
    public static async initReservation(req: Request, res: Response) {
        
    }

    public static async getReservationHoursAt(req: Request, res: Response) {
        
    }

    public static async getHomepageView(req: Request, res: Response, next: Function) {
        return res.render('pages/homepage/homepage')
    }
    public static async getHomepageReservationView(req: Request, res: Response, next: Function) {
        return res.render('pages/homepage/homepage-reservation')
    }
}

export default HomepageController