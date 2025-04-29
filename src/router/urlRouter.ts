import express, { Response } from "express"
import { auth, AuthRequest } from "../middelwares/auth"
import Url from "../models/UrlModel"

const router = express.Router()

// Add debug logging
router.use((req, res, next) => {
    console.log('URL Router - Request received:', {
        method: req.method,
        path: req.path,
        headers: req.headers,
        body: req.body
    });
    next();
});

router.post("/",auth, async (req: AuthRequest, res: Response): Promise<void> => {
    console.log('POST / - Processing request');
    try {
        const { name, url, headers } = req.body
        console.log('Request body:', { name, url, headers });
        const newUrl = await Url.create({
            userId: req.user?.userId,
            name,
            url,
            headers
        })

        await newUrl.save();
        res.status(200).json({
            message: "Url Added Successfully",
            url: newUrl
        })

    } catch (err) {
        console.error('Error in POST /:', err);
        res.status(400).json({
            message: "Failed to add URL",
            error : err
        })
    }
})

router.get("/", auth, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const urls = await Url.find({ userId: req.user?.userId }).sort({ createdAt: -1 })
        res.status(200).json({
            message: "Urls fetched successfully",
            urls
        })

    } catch (err) {
        res.status(400).json({
            message: "Faildes to fetch Urls"
        })
    }
})

router.put("/:id", auth, async (req: AuthRequest, res: Response) => {
    try {
        const { name, url, headers, isActive } = req.body
        const urlId = req.params.id
        const updatedUrl = await Url.findOneAndUpdate({
            _id: urlId,
            userId: req.user?.userId
        }, {
            name,
            url,
            headers,
            isActive
        }, {
            new: true
        })
        if (!updatedUrl) {
            res.status(404).json({ error: 'URL not found' });
        } else {
            res.status(200).json(updatedUrl);
        }

    } catch (err) {
        res.status(400).json({
            message: "Failed to Update URL",
        });
    }
})

router.delete('/:id', auth, async (req: AuthRequest, res: Response) => {
    try {
        const deletedUrl = await Url.findOneAndDelete({
            _id: req.params.id,
            userId: req.user?.userId
        });

        if (!deletedUrl) {
            res.status(404).json({ error: 'URL not found' });
        } else {
            res.json({ message: 'URL deleted successfully' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error deleting URL' });
    }
});

router.get('/:id', auth, async (req: AuthRequest, res: Response) => {
    try {
        const url = await Url.findOne({
            _id: req.params.id,
            userId: req.user?.userId
        });

        if (!url) {
            res.status(404).json({ error: 'URL not found' });
        } else {
            res.json({ message: 'URL fetched successfully',
                url
             });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error Fetching URL' });
    }
});

export default router;
