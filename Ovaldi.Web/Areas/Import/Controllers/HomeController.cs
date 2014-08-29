using Ovaldi.Web.Areas.Import.Service;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Ovaldi.Web.Areas.Import.Controllers
{
    public class HomeController : Controller
    {
        // GET: Import/Home
        public ActionResult Index()
        {
            return View(new ImportOptions());
        }
        [HttpPost]
        public ActionResult Index(ImportOptions model)
        {
            SiteDownloader downloader = new SiteDownloader(model);
            TempData["DownloadList"] = downloader.Download();
            return RedirectToAction("Results");
        }
        public ActionResult Results()
        {
            return View(TempData["DownloadList"]);
        }
    }
}