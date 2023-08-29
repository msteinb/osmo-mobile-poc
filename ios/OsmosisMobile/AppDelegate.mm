#import "AppDelegate.h"

#import <React/RCTBundleURLProvider.h>
#import <React/RCTLog.h>
#import <Contacts/Contacts.h>

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  self.moduleName = @"OsmosisMobile";
  // You can add your custom initial props in the dictionary below.
  // They will be passed down to the ViewController used by React Native.
  self.initialProps = @{};

  CNAuthorizationStatus status = [CNContactStore authorizationStatusForEntityType:CNEntityTypeContacts];
  if (status == CNAuthorizationStatusNotDetermined) {
    [[[CNContactStore alloc] init]
      requestAccessForEntityType:CNEntityTypeContacts
      completionHandler:^(BOOL granted, NSError * _Nullable error)
    {
      RCTLogInfo(@"granted access to contacts");
    }];
  };
  
  return [super application:application didFinishLaunchingWithOptions:launchOptions];
}

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index"];
#else
  return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
}

@end
