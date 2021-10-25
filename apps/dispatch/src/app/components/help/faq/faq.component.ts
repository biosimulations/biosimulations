import {
  Component,
  ViewChild,
  ViewChildren,
  QueryList,
  ElementRef,
} from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import {
  TocSection,
  TocSectionsContainerDirective,
  QAComponent,
} from '@biosimulations/shared/ui';
import { ConfigService } from '@biosimulations/shared/angular';
import { FAQPage, Question, WithContext } from 'schema-dts';
import sanitizeHtml from 'sanitize-html';

@Component({
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.scss'],
})
export class FaqComponent {
  tocSections!: Observable<TocSection[]>;

  @ViewChild(TocSectionsContainerDirective)
  set tocSectionsContainer(container: TocSectionsContainerDirective) {
    setTimeout(() => {
      this.tocSections = container.sections$;
    });
  }

  private faqsJsonLd = new BehaviorSubject<WithContext<FAQPage> | null>(null);
  faqsJsonLd$ = this.faqsJsonLd.asObservable();

  @ViewChildren(QAComponent, { read: ElementRef })
  set faqs(qaComponents: QueryList<ElementRef>) {
    setTimeout(() => {
      const faqs: WithContext<FAQPage> = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: qaComponents.map((qaComponent: ElementRef): Question => {
          return {
            '@type': 'Question',
            name: sanitizeHtml(
              qaComponent.nativeElement.children[0].children[0].innerHTML,
            ),
            acceptedAnswer: {
              '@type': 'Answer',
              text: sanitizeHtml(
                qaComponent.nativeElement.children[0].children[1].innerHTML,
                {
                  allowedTags: [
                    'b',
                    'i',
                    'em',
                    'strong',
                    'sub',
                    'sup',
                    'ul',
                    'ol',
                    'li',
                    'p',
                    'pre',
                    'code',
                    'a',
                  ],
                  allowedAttributes: {
                    a: ['href'],
                  },
                  exclusiveFilter: function (frame) {
                    return frame.tag === 'a' && !frame.text.trim();
                  },
                  transformTags: {
                    a: function (tagName, attribs) {
                      if (
                        !(
                          attribs.href.startsWith('http://') ||
                          attribs.href.startsWith('https://')
                        )
                      ) {
                        attribs.href =
                          window.location.protocol +
                          '//' +
                          window.location.hostname +
                          attribs.href;
                      }
                      return {
                        tagName: tagName,
                        attribs: attribs,
                      };
                    },
                  },
                },
              ),
            },
          };
        }),
      };
      this.faqsJsonLd.next(faqs);
    });
  }

  emailUrl!: string;
  modelLanguageDocsUrl!: string;
  exampleCombineArchivesUrl!: string;

  constructor(public config: ConfigService) {
    this.emailUrl = 'mailto:' + config.email;

    this.modelLanguageDocsUrl =
      this.config.simulatorsAppUrl + 'conventions/simulation-experiments';
    this.exampleCombineArchivesUrl =
      'https://github.com/' +
      this.config.appConfig.exampleCombineArchives.repoOwnerName +
      '/tree' +
      '/' +
      this.config.appConfig.exampleCombineArchives.repoRef +
      '/' +
      config.appConfig.exampleCombineArchives.repoPath;
  }
}
