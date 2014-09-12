using Kooboo.Common.Web;
using System.Web.Routing;
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

        public HomeController()
        {
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
            var data = new JsonResultData(ModelState);
            data.RunWithTry((jsonData) =>
            {
                var downloader = SiteDownloaderFactory.CreateSiteDownloader(Session.SessionID, model);
                downloader.Download();
                data.RedirectUrl = Url.Action("Downloading", ControllerContext.RequestContext.AllRouteValues());
            });
            return Json(data);
        }

        public ActionResult Downloading()
        {
            var downloader = SiteDownloaderFactory.GetSiteDownloader(Session.SessionID);
            return View(downloader);
        }
        public ActionResult Results(string siteName)
        {
            ViewBag.PreviewUrl = Url.Content("~/") + Ovaldi.Core.Models.SiteExtensions.PREFIX_FRONT_PREVIEW_URL + siteName;
            return View(TempData["DownloadList"]);
        }
    }
}