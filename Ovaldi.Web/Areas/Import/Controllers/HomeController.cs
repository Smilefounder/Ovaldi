using Ovaldi.Core.SiteImport;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Ovaldi.Web.Areas.Import.Controllers
{
    public class HomeController : Controller
    {
        #region .ctor
        ISiteDownloader _siteDownloader;
        public HomeController(ISiteDownloader siteDownloader)
        {
            this._siteDownloader = siteDownloader;
        }
        #endregion
        // GET: Import/Home
        public ActionResult Index()
        {
            return View(new DownloadOptions());
        }
        [HttpPost]
        public ActionResult Index(DownloadOptions model)
        {
            var list = _siteDownloader.Download(model);
            TempData["DownloadList"] = list;
            return RedirectToAction("Results");
        }
        public ActionResult Results()
        {
            return View(TempData["DownloadList"]);
        }
    }
}