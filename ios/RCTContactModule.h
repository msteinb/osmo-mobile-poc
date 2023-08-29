//
//  RCTContactModule.h
//  OsmosisMobile
//
//  Created by Moshe Steinberg on 29/08/2023.
//

#import <React/RCTBridgeModule.h>

NS_ASSUME_NONNULL_BEGIN

@interface RCTContactModule : NSObject <RCTBridgeModule>
- (void)getContactsByName:(NSString *)name callback:(RCTResponseSenderBlock)callback;
@end

NS_ASSUME_NONNULL_END
