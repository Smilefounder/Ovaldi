using Kooboo.Common.Web;
using System.Web.Routing;
using Ovaldi.Core.SiteImport;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Microsoft.AspNet.SignalR;
using System.Threading;

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
                downloader.PageDownloaded += downloader_PageDownloaded;
                downloader.DownloadCompleted += downloader_DownloadCompleted;

                Thread thread = new Thread(() =>
                {
                    downloader.Download();
                });
                thread.Start();

                data.RedirectUrl = Url.Action("Results", new { siteName = model.SiteName });
            });
            return Json(data);
        }

        void downloader_DownloadCompleted(object sender, DownloadCompletedEventArgs e)
        {
            var downloader = (ISiteDownloader)sender;
            var sessionId = ((ISiteDownloader)sender).SessionId;
            var connectionId = ChatHub.GetConnectionId(sessionId);
            if (!string.IsNullOrEmpty(connectionId))
            {
                //GlobalHost.ConnectionManager.GetHubContext<ChatHub>().Clients.Client(connectionId).broadcastMessage("test", "downloader_DownloadCompleted");

                GlobalHost.ConnectionManager.GetHubContext<ChatHub>().Clients.Client(connectionId).onDownloadCompleted(e.DownloadedPages);
            }

            SiteDownloaderFactory.RemoveSiteDownloader(sessionId);
        }

        void downloader_PageDownloaded(object sender, PageDownloadedEventArgs e)
        {
            var downloader = (ISiteDownloader)sender;
            var sessionId = downloader.SessionId;
            var connectionId = ChatHub.GetConnectionId(sessionId);
            if (!string.IsNullOrEmpty(connectionId))
            {
                //GlobalHost.ConnectionManager.GetHubContext<ChatHub>().Clients.Client(connectionId).broadcastMessage("test", "downloader_PageDownloaded");
                GlobalHost.ConnectionManager.GetHubContext<ChatHub>().Clients.Client(connectionId).onPageDownloaded(new { CurrentPage = e.DownloadedPage, DownloadedPages = downloader.DownloadedPages.Count, Remains = downloader.DownloadQueue.Count });
            }
        }

        public ActionResult Results(string siteName)
        {
            var siteDownloader = SiteDownloaderFactory.GetSiteDownloader(Session.SessionID);

            ViewBag.PreviewUrl = Url.Content("~/") + Ovaldi.Core.Models.SiteExtensions.PREFIX_FRONT_PREVIEW_URL + siteName;
            return View(siteDownloader);
        }
    }
}