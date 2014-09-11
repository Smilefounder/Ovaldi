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
            var downloader = SiteDownloaderFactory.GetSiteDownloader(Session.SessionID);
            if (downloader != null)
            {
                data.AddMessage("一个Session只能有一个下载任务");
                data.Success = false;
            }
            else
            {
                downloader = SiteDownloaderFactory.CreateSiteDownloader(Session.SessionID, model);
                downloader.Download();
                data.RedirectUrl = Url.Action("Downloading", ControllerContext.RequestContext.AllRouteValues());
            }
            //var list = _siteDownloader.Download(model);
            //TempData["DownloadList"] = list;
            //return RedirectToAction("Results", new { siteName = model.SiteName });

            return Json(data);
        }

        public ActionResult Downloading()
        {
            return View();
        }
        public ActionResult Results(string siteName)
        {
            ViewBag.PreviewUrl = Url.Content("~/") + Ovaldi.Core.Models.SiteExtensions.PREFIX_FRONT_PREVIEW_URL + siteName;
            return View(TempData["DownloadList"]);
        }
    }
}